"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Layers, Terminal } from 'lucide-react';

const steps = [
    { text: "Accessing Neural Pathways...", icon: Brain, color: "text-cyan-400" },
    { text: "Tracing Etymological Roots...", icon: Terminal, color: "text-emerald-400" },
    { text: "Synthesizing Visual Context...", icon: Layers, color: "text-purple-400" },
    { text: "Rendering Cinematic Output...", icon: Sparkles, color: "text-white" }
];

export default function LoadingWeaver() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1200); // Change step every 1.2s

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center font-mono"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-50" />

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px bg-slate-800 flex-grow" />
                    <span className="text-xs text-slate-500 uppercase tracking-[0.2em]">System Processing</span>
                    <div className="h-px bg-slate-800 flex-grow" />
                </div>

                <div className="h-24 flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center gap-4"
                        >
                            {React.createElement(steps[currentStep].icon, {
                                size: 32,
                                className: `${steps[currentStep].color} animate-pulse`
                            })}
                            <span className={`text-xl ${steps[currentStep].color} font-medium tracking-tight`}>
                                {steps[currentStep].text}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="mt-12 h-1 w-full bg-slate-900 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500"
                    />
                </div>
                <div className="mt-2 text-right">
                    <span className="text-xs text-slate-600 font-mono">V2.0.4 // VISUAL_RAG</span>
                </div>
            </div>
        </motion.div>
    );
}
