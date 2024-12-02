import React, { useEffect, useState } from 'react';
import Chat, { Message } from '@/components/chat/chat';
import apiUrl from '@/config';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button";

interface SkillgapsDemoProps {
  assessmentId: string;
}

const SkillgapsDemo: React.FC<SkillgapsDemoProps> = ({ assessmentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false); // Prevent duplicate calls

//   const templatePrompts = [
//     "Iniziamo con gli scenari",
//     "Quali sono i documenti necessari per dimostrare la conformità al DLgs 81/08 in un'azienda manifatturiera?",
//     "Come posso garantire il rispetto delle normative sulla protezione contro le scariche atmosferiche?",
//     "Qual è l'approccio giusto quando si vuole ridurre il rischio di infortuni sul lavoro in azienda?",
//     "Metti alla prova le mie conoscenze in ambito redazione di un DVR",
//     "Quali sono alcuni elementi fondamentali per migliorare la cultura della sicurezza in azienda?",
//   ];


//   const handleTemplateClick = (prompt: string) => {
//     const newMessage: Message = { role: 'user', content: prompt };
//     handleSendMessage(newMessage);
//   };

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

  const handleSendMessage = async (newMessage: Message) => {
    if (isSendingMessage) return; // Prevent duplicate requests
    setIsSendingMessage(true);
  
    // Store the user message in a temporary variable to ensure it's preserved
    const userMessage = { ...newMessage };
    
    // Update messages with user's message
    setMessages(prevMessages => [...prevMessages, userMessage]);
  
    try {
      if (!threadId) {
        console.error('Thread ID not set');
        setIsSendingMessage(false);
        return;
      }
  
      await createMessage(threadId, 'user', userMessage.content);
  
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
        let isFirstChunk = true;
  
        if (reader) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const text = decoder.decode(value);
              buffer += text;
  
              const boundaryIndex = buffer.lastIndexOf('\n');
              if (boundaryIndex !== -1) {
                const markdownChunk = buffer.slice(0, boundaryIndex + 1);
                buffer = buffer.slice(boundaryIndex + 1);
  
                accumulatedText += markdownChunk;
  
                const assistantMessage: Message = {
                  role: 'assistant',
                  content: accumulatedText,
                };
  
                setMessages(prevMessages => {
                  // Always preserve the user's message
                  const messagesWithoutLastAssistant = isFirstChunk 
                    ? prevMessages 
                    : prevMessages.filter((msg, index, arr) => 
                        index !== arr.length - 1 || msg.role !== 'assistant'
                      );
                  
                  isFirstChunk = false;
                  return [...messagesWithoutLastAssistant, assistantMessage];
                });
              }
            }
  
            // Handle remaining buffer content
            if (buffer.trim()) {
              accumulatedText += buffer;
              const assistantMessage: Message = {
                role: 'assistant',
                content: accumulatedText,
              };
  
              setMessages(prevMessages => {
                const messagesWithoutLastAssistant = prevMessages.filter(
                  (msg, index, arr) => index !== arr.length - 1 || msg.role !== 'assistant'
                );
                return [...messagesWithoutLastAssistant, assistantMessage];
              });
            }
          } catch (error) {
            console.error('Error during stream reading:', error);
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeIOCX7uj8hlHXctlw78-nyLnAOFoQWtnzjw&s"
              alt="Kimpy company logo"
            />
            <AvatarFallback>HR</AvatarFallback>
          </Avatar>
          <h1 className="text-white text-xl font-semibold whitespace-nowrap scroll-m-20 tracking-tight">
            Advanced Skill Gap Analysis with Artificial Intelligence
          </h1>
        </div>
      </header>

      {/* Template Prompts Section */}
      {/* {messages.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
          <div className="grid gap-4 rounded-lg  sm:grid-cols-2 md:grid-cols-2">
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
      )} */}


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

export default SkillgapsDemo;
