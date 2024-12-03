'use client'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Sparkles,
    Send,
    Crosshair,
    Flame,
    Info,
    Target,
    Trophy,
    Sword,
    ChevronLeft,
    ChevronUp,
    ChevronDown,
    Home
} from 'lucide-react';

interface Example {
    question: string;
    context: string;
    icon: any;
}

interface Message {
    type: 'question' | 'answer';
    content: string;
    timestamp: string;
    isComplete?: boolean;
    displayedContent?: string;
}

const PoisoOracle = () => {
    const [isExamplesPanelOpen, setIsExamplesPanelOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [isConsulting, setIsConsulting] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [threadId, setThreadId] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const examples: Example[] = [
        {
            question: "How should I approach an eco round after we get an advantage?",
            context: "Strategic Guidance",
            icon: Target
        },
        {
            question: "Someone is tilting and this is losing us rounds, give me strenght to clear his vision.",
            context: "Mental Fortitude",
            icon: Sword
        },
        {
            question: "What positions should I hold on Mirage A site? (without baiting)",
            context: "Tactical Wisdom",
            icon: Trophy
        }
    ];

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useLayoutEffect(() => {
        scrollToBottom();
    }, [messages]);

    function debounce<F extends (...args: any[]) => any>(func: F, delay: number): (...args: Parameters<F>) => void {
        let timeout: ReturnType<typeof setTimeout>;

        return (...args: Parameters<F>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    const debouncedScrollToBottom = debounce(scrollToBottom, 50);

    const typeAnswer = (answer: string, messageIndex: number) => {
        let index = 0;
        const speed = 15;

        const type = () => {
            if (index < answer.length) {
                setMessages(prev =>
                    prev.map((msg, i) => {
                        if (i === messageIndex) {
                            return {
                                ...msg,
                                displayedContent: (msg.displayedContent || '') + answer.charAt(index)
                            };
                        }
                        return msg;
                    })
                );
                index++;
                debouncedScrollToBottom(); // Smooth scrolling during typing
                scrollToBottom();
                setTimeout(type, speed);
            } else {
                setMessages(prev =>
                    prev.map((msg, i) =>
                        i === messageIndex ? { ...msg, isComplete: true } : msg
                    )
                );
                setIsConsulting(false);
            }
        };

        type();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || isConsulting) return;

        const newQuestion: Message = {
            type: 'question',
            content: question,
            timestamp: new Date().toLocaleTimeString(),
            isComplete: true
        };

        const newAnswer: Message = {
            type: 'answer',
            //content: "Your path to victory requires patience and precision. Remember: Vantaggio = Privilegio = Sicurezza. Trust in your training, and success will follow.",
            content: '',
            timestamp: new Date().toLocaleTimeString(),
            isComplete: false,
            displayedContent: ''
        };

        // Important: Set messages first, then start typing
        setMessages(prev => [...prev, newQuestion, newAnswer]);
        setIsConsulting(true);
        setQuestion('');

        try {
            const response = await fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: question,
                    threadId: threadId
                })
            });

            if (!response.ok) {
                throw new Error('Poiso could now answer... we dont know why :(')
            }

            const data = await response.json();

            if (data.threadId) {
                setThreadId(data.threadId);
            }

            console.log(data.content)
            typeAnswer(data.content, messages.length + 1)

        } catch (error) {
            console.error('Error consulting the Oracle:', error);

            // Update the last message with error state
            setMessages(prev =>
                prev.map((msg, i) =>
                    i === prev.length - 1
                        ? {
                            ...msg,
                            content: "The Oracle's vision is clouded. Please try again later.",
                            isComplete: true,
                            displayedContent: "The Oracle's vision is clouded. Please try again later."
                        }
                        : msg
                )
            );
            setIsConsulting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    const MessageDisplay = ({ message }: { message: Message }) => {
        if (message.type === 'question') {
            return (
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-400 text-sm">Your Question</p>
                        <span className="text-xs text-slate-500">{message.timestamp}</span>
                    </div>
                    <p className="text-slate-200">{message.content}</p>
                </div>
            );
        }

        return (
            <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent p-6 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                        <p className="text-orange-500 font-semibold">Poiso's Wisdom</p>
                        <p className="text-xs text-orange-500/60">Sacred Guidance</p>
                    </div>
                </div>
                {/* Changed this condition to check for displayedContent */}
                {!message.displayedContent ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-slate-700/50" />
                        <Skeleton className="h-4 w-1/2 bg-slate-700/50" />
                    </div>
                ) : (
                    <div className="prose prose-invert prose-orange max-w-none">
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="text-slate-200 leading-relaxed mb-4">{children}</p>,
                                h1: ({ children }) => <h1 className="text-2xl font-bold text-orange-500 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold text-orange-500 mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-bold text-orange-500 mb-2">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc list-inside text-slate-200 mb-4 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside text-slate-200 mb-4 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="text-slate-200">{children}</li>,
                                code: ({ inline, className, children, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
                                    return inline ? (
                                        <code className="bg-slate-800 px-1 py-0.5 rounded text-orange-400" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-orange-400 mb-4">
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    );
                                },
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-orange-500/50 pl-4 italic text-slate-300 mb-4">
                                        {children}
                                    </blockquote>
                                ),
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        className="text-orange-400 hover:text-orange-300 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                strong: ({ children }) => <strong className="font-bold text-orange-400">{children}</strong>,
                                em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                            }}
                        >
                            {message.displayedContent}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen max-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
                <div className="container mx-auto px-3">
                    <div className="h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-1 text-slate-300 hover:text-orange-500 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                            <Home className="w-4 h-4" />
                            <span className="text-sm hidden sm:inline">Return to Sanctuary</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <Crosshair className="w-3 h-3 text-orange-500" />
                            </div>
                            <span className="text-sm text-slate-300">Oracle Chamber</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header - Reduced padding on mobile */}
            <header className="relative text-center py-4 sm:py-12 px-3 overflow-hidden">
                <div className="relative">
                    <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                        Talk with Poiso
                    </h1>
                    <Badge className="mb-2 sm:mb-4 bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 transition-colors">
                        Divine Consultation
                    </Badge>
                    <p className="text-sm text-slate-300 max-w-xl mx-auto px-4">
                        Seek the ancient wisdom that guides champions to victory
                    </p>
                </div>
            </header>

            {/* Mobile Examples Toggle Button */}
            <div className="md:hidden px-3 mb-2">
                <Button 
                    onClick={() => setIsExamplesPanelOpen(!isExamplesPanelOpen)}
                    className="w-full bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/50"
                    variant="outline"
                >
                    <span className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-orange-500" />
                        Sacred Inquiries
                        {isExamplesPanelOpen ? 
                            <ChevronUp className="w-4 h-4 ml-auto" /> : 
                            <ChevronDown className="w-4 h-4 ml-auto" />
                        }
                    </span>
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 container mx-auto px-3 flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Main Oracle Interface */}
                <div className="flex-1 flex flex-col order-2 md:order-1 overflow-hidden">
                    <Card className="flex-1 bg-slate-800/80 border-slate-700/50 backdrop-blur-sm flex flex-col overflow-hidden">
                        <CardContent className="flex-1 p-3 sm:p-6 flex flex-col overflow-hidden">
                            {/* Messages Scroll Area */}
                            <ScrollArea className="flex-1 w-full rounded-md overflow-y-auto">
                                <div className="space-y-4">
                                    {messages.length > 0 ? (
                                        messages.map((message, index) => (
                                            <MessageDisplay key={index} message={message} />
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 text-orange-500/50" />
                                            </div>
                                            <p className="text-sm text-slate-400 mb-2">
                                                Ask your question to receive Poiso's guidance
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Your path to excellence awaits
                                            </p>
                                        </div>
                                    )}
                                    <div ref={scrollAreaRef} />
                                </div>
                                <ScrollBar />
                            </ScrollArea>

                            {/* Input form */}
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Seek Poiso's wisdom..."
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="bg-slate-900/50 border-slate-700/50 resize-none text-slate-200 pr-12"
                                        rows={2}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isConsulting || !question.trim()}
                                        className={`absolute bottom-2 right-2 ${isConsulting ? 'bg-orange-500/50' : 'bg-gradient-to-r from-orange-500 to-red-600'} hover:from-orange-600 hover:to-red-700`}
                                        size="sm"
                                    >
                                        {isConsulting ? (
                                            <Sparkles className="w-4 h-4 animate-pulse" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Guide Panel - Collapsible on mobile */}
                <div className={`md:w-72 order-1 md:order-2 ${!isExamplesPanelOpen && 'hidden md:block'}`}>
                    <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-sm">
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg text-white flex items-center gap-2">
                                <Info className="w-4 h-4 text-orange-500" />
                                Sacred Inquiries
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Exemplars of divine consultation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="space-y-2">
                                {examples.map((example, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-gradient-to-r from-slate-700/30 to-slate-700/20 rounded-lg cursor-pointer 
                                        hover:from-slate-700/40 hover:to-slate-700/30 transition-colors border border-slate-700/50"
                                        onClick={() => {
                                            setQuestion(example.question);
                                            setIsExamplesPanelOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                <example.icon className="w-3 h-3 text-orange-500" />
                                            </div>
                                            <p className="text-xs font-medium text-orange-500">
                                                {example.context}
                                            </p>
                                        </div>
                                        <p className="text-xs text-slate-200">
                                            {example.question}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PoisoOracle;