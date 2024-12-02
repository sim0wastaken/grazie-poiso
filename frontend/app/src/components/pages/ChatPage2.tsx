'use-client'

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Chat, { Message } from '@/components/chat/chat';
import KpiDisplay from "@/components/kpi-display";
import apiUrl from '../config';
import "@/App.css";
import "@/index.css";
import { SkeletonCard } from '@/components/ui/skeleton-card';
import ReportOptionsDialog from '@/components/dialogs/ReportOptionsDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ChatPage2: React.FC = () => {
  const { id: assistantId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [kpiList, /*setKpiList*/] = useState<any[]>([]);
  const [loadingKpi, /*setLoadingKpi*/] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [objectives, /*setObjectives*/] = useState<string[]>([]);
  const [courseName, /*setCourseName*/] = useState<string>("");

  // Function to create a new thread
  const createThread = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${apiUrl}/api/create-thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        const newThreadId = data.thread.id;
        setThreadId(newThreadId);
        console.log("Thread created successfully:", newThreadId);
        return newThreadId;
      } else {
        console.error('Error creating thread:', response.statusText);
      }
    } catch (error) {
      console.error('Error during thread creation:', error);
    }
    return null;
  };

  // Function to create a message in a thread
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
    // Store the user message in a temporary variable to ensure it's preserved
    const userMessage = { ...newMessage };
    
    // Update messages with user's message
    setMessages(prevMessages => [...prevMessages, userMessage]);
  
    try {
      // Create a thread if it doesn't exist
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await createThread();
        if (!currentThreadId) {
          console.error("Failed to create a thread");
          return;
        }
      }
  
      // Create a new message in the thread
      await createMessage(currentThreadId, 'user', userMessage.content);
  
      // Stream the assistant's response
      const response = await fetch(`${apiUrl}/api/stream-run`, {
        method: 'POST',
        body: JSON.stringify({ thread_id: currentThreadId, assistant_id: assistantId }),
        headers: {
          'Content-Type': 'application/json',
        },
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
                  // Always preserve the user's message by filtering out only the last assistant message
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
      console.error('Error during conversation with the backend:', error);
    }
  };

  const handleGenerateReport = async (options: any) => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch(`${apiUrl}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Error generating report:', response.statusText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/pdf')) {
        const blob = await response.blob();
        downloadBlob(blob, 'report.pdf');
      } else {
        throw new Error('Invalid file type returned from the server.');
      }
    } catch (error) {
      console.error('Error during report generation:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 overflow-y-auto flex-wrap text-center">
        <ReportOptionsDialog
          assessment={{
            id: assistantId || '',
            courseName: courseName,
            objectives: objectives,
            conversation: messages.map(message => message.content),
          }}
          onGenerateReport={handleGenerateReport}
          isLoading={isGeneratingReport}
        />
        <div className='my-4'>
          <Card>
            <CardHeader>
              <CardTitle>Condividi Assessment</CardTitle>
              <CardDescription>Link generato univocamente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='overflow-auto'>https://platform.kimpy.com/chat2/{assistantId}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className='mt-2 p-0 size-full'>
                    <CopyButton variant='outline' className='size-full' value={`https://platform.kimpy.com/chat2/${assistantId}`}></CopyButton>
                  </TooltipTrigger>
                  <TooltipContent><p>Copia</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>

        {loadingKpi ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <KpiDisplay kpiList={kpiList} />
        )}
      </div>

      <div className="flex flex-col w-3/4 h-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Svolgimento Assessment</h1>
        <div className="flex-grow overflow-y-auto">
          <Chat
            messages={messages}
            onSendMessage={handleSendMessage}
            userInput={userInput}
            setUserInput={setUserInput}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage2;
