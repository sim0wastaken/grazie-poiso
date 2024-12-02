import React, { useEffect, useState } from 'react';
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

interface JetHrSafetyProps {
  assessmentId: string;
}

const JetHrSafety: React.FC<JetHrSafetyProps> = ({ assessmentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false); // Prevent duplicate calls

  const templatePrompts = [
    "Iniziamo con gli scenari",
    "Quali sono i documenti necessari per dimostrare la conformità al DLgs 81/08 in un'azienda manifatturiera?",
    "Come posso garantire il rispetto delle normative sulla protezione contro le scariche atmosferiche?",
    "Qual è l'approccio giusto quando si vuole ridurre il rischio di infortuni sul lavoro in azienda?",
    "Metti alla prova le mie conoscenze in ambito redazione di un DVR",
    "Quali sono alcuni elementi fondamentali per migliorare la cultura della sicurezza in azienda?",
  ];

  console.log(templatePrompts)

  const handleTemplateClick = (prompt: string) => {
    const newMessage: Message = { role: 'user', content: prompt };
    handleSendMessage(newMessage);
  };

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

      // Stream the assistant's response
      const response = await fetch(`${apiUrl}/api/stream-run`, {
        method: 'POST',
        body: JSON.stringify({ thread_id: threadId, assistant_id: assessmentId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
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
      <header className="sticky top-0 w-full flex h-16 items-center gap-10 border-b bg-stone-700 px-4 md:px-6 max-w-full z-20">
        {/* Left Section: Logo and Title */}
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src="https://media.licdn.com/dms/image/v2/D4D0BAQGYEjrKuwx8YQ/company-logo_200_200/company-logo_200_200/0/1685441294453/jethr_logo?e=2147483647&v=beta&t=2K_NvUmYKOyvPOtcuDg7-rwE5BfnVWnKCqRPVeqlOUA"
              alt="alteredu logo"
            />
            <AvatarFallback>JHR</AvatarFallback>
          </Avatar>
          <h1 className="text-white text-xl font-semibold whitespace-nowrap scroll-m-20 tracking-tight">
            Artificial Intelligence al servizio delle Risorse Umane
          </h1>
        </div>
        <div className="flex items-end sm:max-h-[90vh]">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Guida all'uso</Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-md w-full h-screen overflow-auto rounded-md">
              <DialogHeader>
                <DialogTitle>Come trarre il massimo dal tuo Assessment</DialogTitle>
                <DialogDescription>
                  Scopri come utilizzare al meglio per massimizzare l'apprendimento e ottenere valutazioni pertinenti.
                </DialogDescription>
              </DialogHeader>
            
              <div>
                  <h3 className="text-lg font-semibold">Scopo dell'Assessment</h3>
                  <p>
                    Questo strumento è stato progettato per fornire una valutazione sulle competenze del candidato.
                    L'obiettivo è quello di verificare l'idoneità per ricoprire il ruolo di RSPP.
                  </p>
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Purpose and How it Works */}
                

                {/* How to Make the Most of It */}
                <div>
                  <h3 className="text-lg font-semibold">Come ottenere risultati migliori</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Fai domande specifiche per ottenere risposte dettagliate.</li>
                    <li>Usa gli scenari per simulare situazioni reali e testare le tue competenze.</li>
                    <li>Rispondi in maniera completa e precisa per ottenere un feedback attinente alle tue competenze</li>
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
                <div className="flex flex-col gap-2 mt-2 items-center">
                  {[
                    "Metti alla prova le mie conoscenze sulla redazione di un DVR",
                    "Quali sono i passi fondamentali per condurre una valutazione dei rischi efficace?",
                    "Come coinvolgere i dipendenti nel processo di valutazione dei rischi?",
                    "Come posso misurare l'efficacia della formazione sulla sicurezza nella mia azienda?",
                    "Quali responsabilità sono delegabili e quali no?",
                    "Quali strumenti posso utilizzare per monitorare il rispetto delle normative di sicurezza?",
                    "Che cos'è una valutazione della vulnerabilità e perché è importante?",
                    "Chi è che nomina l'RSPP?",
                    "Quali sono gli obblighi e le responsabilità dell'RSPP?",
                  ].map((prompt, index) => (
                    <DialogClose asChild>
                      <Button
                        key={index}
                        onClick={() => handleTemplateClick(prompt)}
                        variant="outline"
                        className="p-6 whitespace-normal bg-stone-100"
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
          <div className="grid gap-4 bg-white rounded-lg  sm:grid-cols-2 md:grid-cols-2">
            {templatePrompts.map((prompt, index) => (
              <Button
                key={index}
                onClick={() => handleTemplateClick(prompt)}
                className="p-1 size-auto sm:text-xs   md:p-4 md:m-4 text-xs shadow-md md:text-base whitespace-normal break-words"
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

export default JetHrSafety;
