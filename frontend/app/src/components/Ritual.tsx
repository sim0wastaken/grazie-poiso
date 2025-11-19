'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const Ritual = () => {
    const [isCharging, setIsCharging] = useState(false);
    const [progress, setProgress] = useState(0);
    const requestRef = useRef<number>();
    const [completed, setCompleted] = useState(false);

    const triggerCelebration = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#f97316', '#ea580c', '#ffffff']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#f97316', '#ea580c', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    };

    const startCharging = () => {
        if (completed) return;
        setIsCharging(true);
        let currentProgress = 0;

        const animate = () => {
            currentProgress += 1; // Charge speed
            if (currentProgress >= 100) {
                currentProgress = 100;
                setCompleted(true);
                setIsCharging(false);
                triggerCelebration();
            } else {
                setProgress(currentProgress);
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);
    };

    const stopCharging = () => {
        if (completed) return;
        setIsCharging(false);
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        setProgress(0);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <Card className="bg-slate-900/80 border-orange-500/30 overflow-hidden relative">
                <div
                    className="absolute inset-0 bg-orange-500/10 transition-all duration-100"
                    style={{ height: `${progress}%`, bottom: 0, top: 'auto' }}
                />

                <CardContent className="p-8 flex flex-col items-center justify-center text-center relative z-10">
                    <AnimatePresence mode="wait">
                        {completed ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <h3 className="text-2xl font-bold text-orange-500 mb-2">Blessing Received</h3>
                                <p className="text-slate-300">Go forth and conquer.</p>
                                <Button
                                    variant="ghost"
                                    className="mt-4 text-slate-400 hover:text-white"
                                    onClick={() => {
                                        setCompleted(false);
                                        setProgress(0);
                                    }}
                                >
                                    Perform Ritual Again
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full"
                            >
                                <h3 className="text-xl font-bold text-white mb-6">
                                    Hold to Channel Poiso's Energy
                                </h3>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        size="lg"
                                        className={`w-32 h-32 rounded-full border-4 transition-all duration-300 ${isCharging
                                                ? 'bg-orange-500 border-orange-300 shadow-[0_0_30px_rgba(249,115,22,0.5)]'
                                                : 'bg-slate-800 border-orange-500/50 hover:border-orange-500'
                                            }`}
                                        onMouseDown={startCharging}
                                        onMouseUp={stopCharging}
                                        onMouseLeave={stopCharging}
                                        onTouchStart={startCharging}
                                        onTouchEnd={stopCharging}
                                    >
                                        <Flame
                                            className={`w-12 h-12 transition-all duration-300 ${isCharging ? 'text-white scale-125' : 'text-orange-500'
                                                }`}
                                        />
                                    </Button>
                                </motion.div>

                                <p className="mt-6 text-sm text-slate-400">
                                    {isCharging ? "Channeling..." : "Press and hold"}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
};
