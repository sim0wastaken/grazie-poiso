import { useState } from 'react';

export type Message = {
    role: 'user' | 'assistant',
    content: string
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (content: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Add user message to state
            const userMessage: Message = {role: 'user', content};
            setMessages(prev => [...prev, userMessage]);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                })
            });

            if(!response.ok) {
                throw new Error('Failed to send message')
            }

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.content
            }]);

        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred. idk what lol')
        } finally {
            setIsLoading(false);
        };
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage
    };
}