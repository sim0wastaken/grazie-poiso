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

interface ALtereduFormazioneSpecificaProps {
    assessmentId: string;
    title: string;
}

const ALtereduFormazioneSpecifica: React.FC<ALtereduFormazioneSpecificaProps> = ({ assessmentId, title }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [threadId, setThreadId] = useState<string | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false); // Prevent duplicate calls

    // Firestore setup
    const firestore = getFirestore();

    const templatePrompts = [
        "Obblighi del Datore di Lavoro per le attrezzature di sicurezza",
        "Quali sono gli obblighi del Lavoratore nell'uso delle attrezzature di sicurezza?",
        "Cosa sono i DPI, come si classificano e come si usano?",
        "Cos'è il rischio biologico e come si gestice?",
        "Qual è la differenza tra Vibrazioni Mano-Braccio (HAV) e Vibrazioni Corpo Intero (WBV)?",
        "Cos'è lo Stress da Lavoro Correlato e quali effetti può avere?",
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
                                    Chiarisci qualsiasi tuo dubbio in ambito sicurezza sul lavoro.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Scopo del Tutor */}
                                <div>
                                    <h3 className="text-lg font-semibold">Scopo del Tutor Virtuale</h3>
                                    <p>
                                        Il Tutor Virtuale è stato creato per supportarti nel tuo percorso di formazione sulla sicurezza base di 4 ore.
                                        Ti aiuterà a comprendere i concetti fondamentali, rispondere a domande specifiche e applicare le conoscenze
                                        apprese attraverso esempi pratici.
                                    </p>
                                </div>

                                {/* Come utilizzare il Tutor */}
                                <div>
                                    <h3 className="text-lg font-semibold">Come utilizzare il Tutor</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Fai domande specifiche per ricevere chiarimenti sui concetti fondamentali della sicurezza.</li>
                                        <li>Segui le indicazioni fornite per approfondire argomenti chiave durante il corso.</li>
                                        <li>Applica i suggerimenti per risolvere esercizi pratici e migliorare la tua comprensione.</li>
                                    </ul>
                                </div>

                                {/* Funzionalità del Tutor */}
                                <div>
                                    <h3 className="text-lg font-semibold">Funzionalità del Tutor</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Risposte immediate:</strong> Chiarimenti su concetti e procedure di sicurezza.</li>
                                        <li><strong>Scenari pratici:</strong> Esercitazioni su situazioni di sicurezza comuni.</li>
                                        <li><strong>Supporto interattivo:</strong> Guida per affrontare le domande del corso in autonomia.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Esempi di Domande */}
                            <div className="grid grid-cols-1 gap-6">
                                <h3 className="text-lg font-semibold">Esempi di Domande</h3>
                                <div className="flex flex-wrap gap-2 mt-2 justify-center items-center">
                                    {[
                                        "Quali sono le responsabilità di un lavoratore in materia di sicurezza?",
                                        "Come si riconoscono situazioni di rischio sul posto di lavoro?",
                                        "Cosa fare in caso di emergenza durante l'orario lavorativo?",
                                        "Quali sono i principali diritti e doveri secondo la normativa sulla sicurezza?",
                                        "In che modo prevenire gli infortuni sul lavoro?",
                                        "Qual è l'importanza dei dispositivi di protezione individuale?",
                                        "Quali sono i rischi più comuni nel settore in cui lavoro?",
                                        "Come segnalare un incidente o un rischio?",
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

export default ALtereduFormazioneSpecifica;
