import React, { useEffect, useState } from 'react';
import { EtymologyData } from './TriptychDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import * as fal from "@fal-ai/client";

// Configure Fal to use our proxy
fal.config({
    proxyUrl: "/api/fal/proxy",
});

interface InfographicDisplayProps {
    data: EtymologyData & { video_prompt?: string };
}

export default function InfographicDisplay({ data }: InfographicDisplayProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Reset video state when data changes
        setVideoUrl(null);
        setIsGenerating(false);

        const generateVideo = async () => {
            if (!data.image_url || !data.video_prompt || data.image_url.includes('placeholder')) return;

            setIsGenerating(true);
            try {
                console.log("Starting Living Archive generation...", data.video_prompt);
                const result: any = await fal.subscribe("fal-ai/minimax/video-01/image-to-video", {
                    input: {
                        prompt: data.video_prompt + ", cinematic, high quality, 4k",
                        image_url: data.image_url,
                    },
                    logs: true,
                    onQueueUpdate: (update) => {
                        if (update.status === 'IN_PROGRESS') {
                            update.logs.map((log) => log.message).forEach(console.log);
                        }
                    },
                });

                if (result && result.video && result.video.url) {
                    console.log("Living Archive Ready:", result.video.url);
                    setVideoUrl(result.video.url);
                }
            } catch (error) {
                console.error("Error generating video:", error);
            } finally {
                setIsGenerating(false);
            }
        };

        // Start generation
        generateVideo();
    }, [data.word, data.image_url, data.video_prompt]);

    return (
        <div className="w-full h-full flex justify-center p-4 md:p-8 bg-stone-900 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-3xl bg-[#fdfbf7] text-stone-900 shadow-2xl overflow-hidden font-serif aspect-[1/1.4] flex flex-col p-8 md:p-12"
            >
                {/* Vintage Paper Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
                <div className="absolute inset-0 pointer-events-none border-[16px] border-double border-stone-300 opacity-50"></div>

                {/* Header */}
                <header className="relative z-10 flex flex-col items-center mb-8 border-b-2 border-stone-900 pb-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs font-bold tracking-[0.3em] uppercase mb-2 text-stone-500"
                    >
                        L'Étymologie Illustrée
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter text-stone-900 capitalize"
                    >
                        {data.word}
                    </motion.h1>
                </header>

                {/* Main Visual */}
                <div className="relative z-10 flex-grow grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Image */}
                    <div className="md:col-span-7 flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="relative w-full aspect-[4/5] border-4 border-stone-900 p-2 bg-white shadow-lg rotate-1"
                        >
                            <AnimatePresence mode='wait'>
                                {videoUrl ? (
                                    <motion.video
                                        key="video"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 2 }}
                                        src={videoUrl}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover z-20 m-2"
                                        style={{ width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
                                    />
                                ) : null}
                            </AnimatePresence>

                            {data.image_url ? (
                                <motion.img
                                    initial={{ scale: 1.1, filter: "blur(10px)" }}
                                    animate={{ scale: 1, filter: "blur(0px)" }}
                                    transition={{ delay: 0.8, duration: 1.5 }}
                                    src={data.image_url}
                                    alt={data.visual_subject}
                                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700 relative z-10"
                                />
                            ) : (
                                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 italic">
                                    Archive Missing
                                </div>
                            )}

                            {/* Status Indicator */}
                            <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
                                <div className={`bg-white/90 px-2 py-1 text-xs font-mono border border-stone-900 flex items-center gap-2`}>
                                    <span>FIG. 1: {data.visual_subject}</span>
                                    {isGenerating && !videoUrl && (
                                        <span className="flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-600 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                        </span>
                                    )}
                                </div>
                                {videoUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-amber-100 px-2 py-1 text-[10px] uppercase font-bold text-amber-900 border border-amber-900 tracking-wider"
                                    >
                                        Living Archive
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Text */}
                    <div className="md:col-span-5 flex flex-col justify-between">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                                className="mb-6"
                            >
                                <h3 className="text-sm font-bold uppercase tracking-widest border-b border-stone-400 pb-1 mb-2">Root Origin</h3>
                                <p className="text-2xl font-bold italic text-amber-900 font-serif">
                                    "{data.root}"
                                </p>
                                <p className="text-sm text-stone-600 mt-1 italic">
                                    {data.root_concept}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 1 }}
                            >
                                <h3 className="text-sm font-bold uppercase tracking-widest border-b border-stone-400 pb-1 mb-2">The Story</h3>
                                <p className="text-sm md:text-base leading-relaxed text-stone-800 text-justify first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-amber-900">
                                    {data.story}
                                </p>
                            </motion.div>
                        </div>

                        {/* Footer / Meta in box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            className="mt-8 border-2 border-stone-900 p-4 bg-amber-50/50"
                        >
                            <h4 className="font-bold text-xs uppercase mb-2">Semantic Evolution</h4>
                            <div className="flex items-center justify-between text-sm">
                                <span>{data.root}</span>
                                <span className="text-stone-400">→</span>
                                <span className="font-bold">{data.word}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-10 mt-8 pt-4 border-t border-stone-300 flex justify-between items-end text-stone-500">
                    <div className="flex flex-col">
                        <span className="font-bold text-xs tracking-widest uppercase text-stone-900">Le Mot Clef</span>
                        <span className="text-[10px] font-mono">Digital Archive No. {Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="text-[10px] uppercase font-mono tracking-widest">
                        {new Date().toLocaleDateString()}
                    </div>
                </footer>
            </motion.div>
        </div>
    );
}
