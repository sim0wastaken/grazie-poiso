import React, { useEffect, useState } from 'react';
import { getFirestore, doc, updateDoc, setDoc, increment } from 'firebase/firestore';
import Chat, { Message } from '@/components/chat/chat';
import apiUrl from '@/config';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

interface AltereduCybersecPageProps {
  assessmentId: string;
  title: string;
}

const AltereduCybersecPage: React.FC<AltereduCybersecPageProps> = ({ assessmentId, title }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false); // Prevent duplicate calls

  // Firestore setup
  const firestore = getFirestore();

  const templatePrompts = [
    "Iniziamo con gli scenari",
    "Quali sono le implicazioni legali della NIS2 per le aziende italiane?",
    "Quali sono gli obblighi principali per conformarsi alla direttiva NIS2?",
    "Che cos'è una valutazione della vulnerabilità e perché è importante?",
    "Puoi spiegare le sanzioni per il mancato adeguamento alla NIS2?",
    "Come l'Italia recepisce e implementa la NIS2 rispetto agli altri paesi europei?",
  ];

  console.log(templatePrompts)

  const handleTemplateClick = (prompt: string) => {
    const newMessage: Message = { role: 'user', content: prompt };
    handleSendMessage(newMessage);
  };

  // Log page visit
  useEffect(() => {
    const logVisit = async () => {
      try {
        const usageRef = doc(firestore, `alteredu/usage/${assessmentId}/metrics`);
        await setDoc(
          usageRef,
          { pageVisits: increment(1) }, // Increment pageVisits
          { merge: true } // Merge if the document exists
        );
        console.log('Page visit logged successfully');
      } catch (error) {
        console.error('Error logging page visit:', error);
      }
    };

    logVisit();
  }, [assessmentId, firestore]);

  // Check or create thread_id in local storage
  useEffect(() => {
    const storedThreadId = localStorage.getItem(`thread_id_${assessmentId}`);
    if (storedThreadId) {
      console.log('thread_id found in local storage, using it');
      setThreadId(storedThreadId);

      // Fetch and display old messages
      fetchMessages(storedThreadId).then((fetchedMessages) => {
        if (fetchedMessages) {
          setMessages(fetchedMessages);
        }
      });
    } else {
      console.log('No thread_id found in local storage. Creating a new one');
      createThread().then((newThreadId) => {
        if (newThreadId) {
          localStorage.setItem(`thread_id_${assessmentId}`, newThreadId);
          setThreadId(newThreadId);
        }
      });
    }
  }, [assessmentId]);

  // Log message sent to Firestore
  const logMessageSent = async () => {
    try {
      const usageRef = doc(firestore, `alteredu/usage/${assessmentId}/metrics`);
      await setDoc(
        usageRef,
        { messagesSent: increment(1) }, // Increment messagesSent
        { merge: true } // Merge if the document exists
      );
      console.log('Message count incremented');
    } catch (error) {
      console.error('Error logging message:', error);
    }
  };

  // Fetch messages for an existing thread
  const fetchMessages = async (threadId: string, limit = 20, order = 'asc'): Promise<Message[] | null> => {
    try {
      const formData = new FormData();
      formData.append('thread_id', threadId);
      formData.append('limit', limit.toString());
      formData.append('order', order);

      const response = await fetch(`${apiUrl}/api/list-message`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Raw fetched messages:', data);

        // Normalize the messages data
        if (data.messages && data.messages.data) {
          const normalizedMessages = data.messages.data.map((msg: any) => {
            // Extract text content
            const contentTexts = msg.content
              .filter((content: any) => content.type === 'text')
              .map((content: any) => content.text.value)
              .join(' '); // Combine all text parts if needed

            return {
              id: msg.id,
              role: msg.role,
              content: contentTexts,
            };
          });

          console.log('Normalized messages:', normalizedMessages);
          return normalizedMessages;
        } else {
          console.error('Unexpected messages structure:', data);
          return null;
        }
      } else {
        console.error('Error fetching messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetchMessages:', error);
    }
    return null;
  };

  // Create a thread
  const createThread = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${apiUrl}/api/create-thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return data.thread.id;
      } else {
        console.error('Error creating thread:', response.statusText);
      }
    } catch (error) {
      console.error('Error during thread creation:', error);
    }
    return null;
  };

  // Create a message
  const createMessage = async (threadId: string, role: string, content: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('thread_id', threadId);
      formData.append('role', role);
      formData.append('text', content);

      const response = await fetch(`${apiUrl}/api/create-message`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Error creating message:', response.statusText);
      }
    } catch (error) {
      console.error('Error during message creation:', error);
    }
  };

  // Handle user message
  const handleSendMessage = async (newMessage: Message) => {
    if (isSendingMessage) return; // Prevent duplicate requests
    setIsSendingMessage(true);

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      if (!threadId) {
        console.error('Thread ID not set');
        setIsSendingMessage(false);
        return;
      }

      await createMessage(threadId, 'user', newMessage.content);

      // Log message sent to Firestore
      try {
        const usageRef = doc(firestore, `alteredu/usage/${assessmentId}/metrics`);
        await updateDoc(usageRef, {
          messagesSent: increment(1),
        });
        console.log('Message count incremented');
      } catch (error) {
        console.error('Error logging message:', error);
      }

      // Stream the assistant's response
      const response = await fetch(`${apiUrl}/api/stream-run`, {
        method: 'POST',
        body: JSON.stringify({ thread_id: threadId, assistant_id: assessmentId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        await logMessageSent();
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let buffer = '';

        if (reader) {
          let chunk;
          while (!(chunk = await reader.read()).done) {
            const text = decoder.decode(chunk.value);
            buffer += text;

            // Update only when a markdown-friendly boundary is reached
            const boundaryIndex = buffer.lastIndexOf('\n');
            if (boundaryIndex !== -1) {
              const markdownChunk = buffer.slice(0, boundaryIndex + 1);
              buffer = buffer.slice(boundaryIndex + 1); // Keep the remaining text in buffer

              accumulatedText += markdownChunk;

              // Create a new assistant message
              const assistantMessage: Message = {
                role: 'assistant',
                content: accumulatedText,
              };

              // Update the state with the new message
              setMessages((prevMessages) => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                if (lastMessage && lastMessage.role === 'assistant') {
                  return [...prevMessages.slice(0, -1), assistantMessage];
                } else {
                  return [...prevMessages, assistantMessage];
                }
              });
            }
          }

          // Handle any remaining text in the buffer after streaming ends
          if (buffer.trim()) {
            accumulatedText += buffer;
            const assistantMessage: Message = {
              role: 'assistant',
              content: accumulatedText,
            };
            setMessages((prevMessages) => [...prevMessages.slice(0, -1), assistantMessage]);
          }
        }
      } else {
        console.error('Error streaming assistant response:', response.statusText);
      }
    } catch (error) {
      console.error('Error during conversation:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full flex h-16 items-center gap-10 border-b bg-blue-500 px-4 md:px-6 max-w-full z-20">
        {/* Left Section: Logo and Title */}
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0PrR7SbaO8CwxcaDi1s3TqlUIfnVtlq1mP8A5JZOIrPQFqed_AzKn4KtvezcG3wHSl-U&usqp=CAU"
              alt="alteredu logo"
            />
            <AvatarFallback>AlterEdu</AvatarFallback>
          </Avatar>
          <h1 className="text-white text-xl font-semibold whitespace-nowrap scroll-m-20 tracking-tight">
            {title}
          </h1>
        </div>
        <div className="flex items-end sm:max-h-[90vh]">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Guida all'uso</Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-md w-full h-screen overflow-auto rounded-md">
              <DialogHeader>
                <DialogTitle>Come trarre il massimo dal tuo Tutor Virtuale</DialogTitle>
                <DialogDescription>
                  Scopri come utilizzare al meglio il tuo Tutor AI per la cybersecurity.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Purpose and How it Works */}
                <div>
                  <h3 className="text-lg font-semibold">Scopo del Tutor</h3>
                  <p>
                    Il tuo Tutor Virtuale è progettato per aiutarti a comprendere e implementare i concetti chiave della
                    cybersecurity e della direttiva NIS2. Puoi usarlo per generare scenari pratici, rispondere a domande
                    specifiche e migliorare le tue competenze con esempi concreti.
                  </p>
                </div>

                {/* How to Make the Most of It */}
                <div>
                  <h3 className="text-lg font-semibold">Come utilizzare al meglio il Tutor</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Fai domande specifiche per ottenere risposte dettagliate.</li>
                    <li>Usa gli scenari per simulare situazioni reali e testare le tue competenze.</li>
                    <li>Interagisci con i suggerimenti predefiniti per avviare conversazioni mirate.</li>
                  </ul>
                </div>

                {/* Capabilities */}
                <div>
                  <h3 className="text-lg font-semibold">Capacità del Tutor</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Generazione di scenari:</strong> Simula incidenti di sicurezza per esercitarti.</li>
                    <li><strong>Domande e Risposte:</strong> Ottieni informazioni su normative, rischi e misure di sicurezza.</li>
                    <li><strong>Guida pratica:</strong> Approfondisci concetti come GDPR e Modello 231.</li>
                  </ul>
                </div>
              </div>

              {/* Example Questions */}
              <div className="grid grid-cols-1 gap-6">
                <h3 className="text-lg font-semibold">Esempi di Domande</h3>
                <div className="flex flex-wrap gap-2 mt-2 justify-center items-center">
                  {[
                    "Quali sono i principali obiettivi della direttiva NIS2?",
                    "Come creare un piano efficace di risposta agli incidenti?",
                    "Che cos'è un modello organizzativo per la sicurezza informatica?",
                    "Quali sono le implicazioni legali della NIS2 per le aziende italiane?",
                    "In che modo il modello 231 si collega alla direttiva NIS2?",
                    "Quali sono gli obblighi principali per conformarsi alla direttiva NIS2?",
                    "Che cos'è una valutazione della vulnerabilità e perché è importante?",
                    "Puoi spiegare le sanzioni per il mancato adeguamento alla NIS2?",
                    "Come l'Italia recepisce e implementa la NIS2 rispetto agli altri paesi europei?",
                  ].map((prompt, index) => (
                    <DialogClose asChild>
                      <Button
                        key={index}
                        onClick={() => handleTemplateClick(prompt)}
                        variant="outline"
                        className="p-6 whitespace-normal bg-slate-100"
                      >
                        {prompt}
                      </Button>
                    </DialogClose>

                  ))}
                </div>
              </div>

              <DialogFooter className="mt-3">
                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    Chiudi
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Template Prompts Section */}
      {messages.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
          <div className="grid gap-4 bg-white rounded-lg sm:grid-cols-2 md:grid-cols-2">
            {templatePrompts.map((prompt, index) => (
              <Button
                key={index}
                onClick={() => handleTemplateClick(prompt)}
                className="p-1 size-auto sm:text-xs md:p-4 md:m-4 text-xs shadow-md md:text-base whitespace-normal break-words"
                variant="outline"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}


      {/* Chat Component */}
      <div className="relative flex-grow overflow-hidden">
        <Chat
          messages={messages}
          onSendMessage={handleSendMessage}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </div>
    </>
  );
};

export default AltereduCybersecPage;
