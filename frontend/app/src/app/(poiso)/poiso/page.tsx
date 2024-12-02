'use client'
import React, { useState, useRef, useEffect } from 'react';
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
    const [question, setQuestion] = useState('');
    const [isConsulting, setIsConsulting] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const examples: Example[] = [
        {
            question: "How should I approach an eco round?",
            context: "Strategic Guidance",
            icon: Target
        },
        {
            question: "Give me strength for this important match.",
            context: "Mental Fortitude",
            icon: Sword
        },
        {
            question: "What positions should I hold on Mirage A site?",
            context: "Tactical Wisdom",
            icon: Trophy
        }
    ];

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollArea = scrollAreaRef.current;
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    };

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
            content: "Your path to victory requires patience and precision. Remember: Vantaggio = Privilegio = Sicurezza. Trust in your training, and success will follow.",
            timestamp: new Date().toLocaleTimeString(),
            isComplete: false,
            displayedContent: ''
        };

        // Important: Set messages first, then start typing
        setMessages(prev => [...prev, newQuestion, newAnswer]);
        setIsConsulting(true);
        setQuestion('');

        // Calculate the index for the answer message
        setTimeout(() => {
            typeAnswer(newAnswer.content, messages.length + 1);
        }, 500);
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
                    <p className="text-slate-200 leading-relaxed">{message.displayedContent}</p>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col">
            {/* Responsive Navigation */}
            <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
                <div className="container mx-auto px-3 lg:px-4">
                    <div className="h-14 sm:h-16 flex items-center justify-between sm:justify-start sm:space-x-4">
                        <Link
                            href="/"
                            className="flex items-center gap-1 sm:gap-2 text-slate-300 hover:text-orange-500 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <Home className="w-4 h-4" />
                            <span className="text-sm sm:text-base hidden sm:inline">Return to Sanctuary</span>
                        </Link>

                        <div className="hidden sm:block h-4 w-px bg-slate-700/50" />

                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <Crosshair className="w-3 h-3 text-orange-500" />
                            </div>
                            <span className="text-sm sm:text-base text-slate-300">Oracle Chamber</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Responsive Header */}
            <header className="relative text-center py-8 sm:py-12 px-3 sm:px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
                <div className="relative">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                        Poiso's Oracle
                    </h1>
                    <Badge className="mb-3 sm:mb-4 bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 transition-colors">
                        Divine Consultation
                    </Badge>
                    <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto px-4">
                        Seek the ancient wisdom that guides champions to victory
                    </p>
                </div>
            </header>

            {/* Main Content Area - Remaining height */}
            <div className="flex-1 container mx-auto px-3 lg:px-4 py-4 sm:py-8 flex flex-col md:flex-row gap-4 sm:gap-6 overflow-hidden">
                {/* Main Oracle Interface */}
                <div className="flex-1 flex flex-col order-2 md:order-1 overflow-hidden">
                    <Card className="flex-1 bg-slate-800/80 border-slate-700/50 backdrop-blur-sm flex flex-col overflow-hidden">
                        <CardContent className="flex-1 p-3 sm:p-6 flex flex-col overflow-hidden">
                            {/* Messages Scroll Area */}
                            <ScrollArea className="h-[60vh] w-full rounded-md">
                                <div className="space-y-4 sm:space-y-6">
                                    {messages.length > 0 ? (
                                        messages.map((message, index) => (
                                            <MessageDisplay key={index} message={message} />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500/50" />
                                            </div>
                                            <p className="text-sm sm:text-base text-slate-400 mb-2">
                                                Ask your question to receive Poiso's guidance
                                            </p>
                                            <p className="text-xs sm:text-sm text-slate-500">
                                                Your path to excellence awaits
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <ScrollBar/>
                            </ScrollArea>

                            {/* Input form - Fixed height */}
                            <form onSubmit={handleSubmit} className="mt-4 flex-shrink-0">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Seek Poiso's wisdom..."
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="bg-slate-900/50 border-slate-700/50 resize-none text-slate-200 pr-12 text-sm sm:text-base"
                                        rows={2}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isConsulting || !question.trim()}
                                        className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 ${isConsulting ? 'bg-orange-500/50' : 'bg-gradient-to-r from-orange-500 to-red-600'
                                            } hover:from-orange-600 hover:to-red-700`}
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

                {/* Guide Panel */}
                <div className="md:w-72 lg:w-80 order-1 md:order-2">
                    <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-sm">
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl text-white flex items-center gap-2">
                                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                Sacred Inquiries
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Exemplars of divine consultation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-6 pt-0">
                            <div className="space-y-2 sm:space-y-3">
                                {examples.map((example, index) => (
                                    <div
                                        key={index}
                                        className="p-3 sm:p-4 bg-gradient-to-r from-slate-700/30 to-slate-700/20 rounded-lg cursor-pointer 
                    hover:from-slate-700/40 hover:to-slate-700/30 transition-colors border border-slate-700/50"
                                        onClick={() => setQuestion(example.question)}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                <example.icon className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                                            </div>
                                            <p className="text-xs sm:text-sm font-medium text-orange-500">
                                                {example.context}
                                            </p>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-200">
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