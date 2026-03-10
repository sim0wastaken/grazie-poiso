'use client'
import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
    Message,
    MessageContent,
    MessageResponse,
} from '@/components/ai-elements/message';
import {
    PromptInput,
    PromptInputTextarea,
    PromptInputSubmit,
    PromptInputFooter,
    type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import {
    Sparkles,
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
    icon: React.ElementType;
}

const PoisoOracle = () => {
    const [isExamplesPanelOpen, setIsExamplesPanelOpen] = useState(false);
    const [input, setInput] = useState('');

    const { messages, sendMessage, status, stop } = useChat({
        transport: new DefaultChatTransport({ api: '/api/chat' }),
    });

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

    const handleSubmit = (message: PromptInputMessage) => {
        if (!message.text?.trim()) return;
        sendMessage({ text: message.text });
        setInput('');
    };

    const handleExampleClick = (question: string) => {
        sendMessage({ text: question });
        setIsExamplesPanelOpen(false);
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

            {/* Header */}
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
                            <Conversation className="flex-1">
                                <ConversationContent className="gap-4">
                                    {messages.length === 0 ? (
                                        <ConversationEmptyState
                                            title="Ask your question to receive Poiso's guidance"
                                            description="Your path to excellence awaits"
                                            icon={<Sparkles className="w-6 h-6 text-orange-500/50" />}
                                        />
                                    ) : (
                                        messages.map((message) => (
                                            <Fragment key={message.id}>
                                                {message.role === 'user' ? (
                                                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                                                        <p className="text-slate-400 text-sm mb-2">Your Question</p>
                                                        <p className="text-slate-200">
                                                            {message.parts.map((part, i) =>
                                                                part.type === 'text' ? <span key={i}>{part.text}</span> : null
                                                            )}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent p-6 rounded-lg border border-orange-500/20">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                                <Flame className="w-4 h-4 text-orange-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-orange-500 font-semibold">Poiso&apos;s Wisdom</p>
                                                                <p className="text-xs text-orange-500/60">Sacred Guidance</p>
                                                            </div>
                                                        </div>
                                                        <div className="prose prose-invert prose-orange max-w-none">
                                                            {message.parts.map((part, i) => {
                                                                if (part.type === 'text') {
                                                                    return (
                                                                        <MessageResponse key={i}>
                                                                            {part.text}
                                                                        </MessageResponse>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </Fragment>
                                        ))
                                    )}

                                    {status === 'streaming' && messages.length > 0 &&
                                        messages[messages.length - 1].role === 'user' && (
                                            <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent p-6 rounded-lg border border-orange-500/20">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                        <Flame className="w-4 h-4 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-orange-500 font-semibold">Poiso&apos;s Wisdom</p>
                                                        <p className="text-xs text-orange-500/60">Sacred Guidance</p>
                                                    </div>
                                                </div>
                                                <Shimmer>Consulting the oracle...</Shimmer>
                                            </div>
                                        )}
                                </ConversationContent>
                                <ConversationScrollButton />
                            </Conversation>

                            {/* Input */}
                            <PromptInput
                                onSubmit={handleSubmit}
                                className="mt-4 bg-slate-900/50 border-slate-700/50 rounded-lg"
                            >
                                <PromptInputTextarea
                                    value={input}
                                    onChange={(e) => setInput(e.currentTarget.value)}
                                    placeholder="Seek Poiso's wisdom..."
                                    className="text-slate-200"
                                />
                                <PromptInputFooter>
                                    <div />
                                    <PromptInputSubmit
                                        status={status}
                                        onStop={stop}
                                    />
                                </PromptInputFooter>
                            </PromptInput>
                        </CardContent>
                    </Card>
                </div>

                {/* Guide Panel */}
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
                                        onClick={() => handleExampleClick(example.question)}
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
