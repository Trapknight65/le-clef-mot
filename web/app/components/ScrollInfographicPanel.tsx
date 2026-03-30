"use client";

import React, { useState, useRef, useEffect, UIEvent } from 'react';
import { motion } from 'framer-motion';
import { VideoScript } from '@/lib/types';
import { Zap, Play, Pause } from 'lucide-react';

interface ScrollInfographicPanelProps {
    script: VideoScript | null;
    images?: { cora: string; historical: string | null };
    loading?: boolean;
}

export default function ScrollInfographicPanel({ script, images, loading }: ScrollInfographicPanelProps) {
    const [isAutoplaying, setIsAutoplaying] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync active index based on user scroll position
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const newIndex = Math.round(target.scrollTop / target.clientHeight);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    // Auto-scroll loop simulating a video player
    useEffect(() => {
        if (!isAutoplaying || !script) return;
        
        const currentScene = script.timeline[activeIndex];
        const durationMs = (currentScene?.duration || 6) * 1000;
        
        const timer = setTimeout(() => {
            if (activeIndex < script.timeline.length - 1) {
                const container = containerRef.current;
                if (container) {
                    const nextSlide = container.children[activeIndex + 1] as HTMLElement;
                    nextSlide?.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                setIsAutoplaying(false); // Stop at the end
            }
        }, durationMs);

        return () => clearTimeout(timer);
    }, [isAutoplaying, activeIndex, script]);

    if (loading || !script) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 border border-white/10 rounded-2xl overflow-hidden aspect-[9/16] relative text-center">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,171,0.1)_0%,transparent_70%)] animate-pulse" />
                 <Zap className="animate-[pulse_1.5s_ease-in-out_infinite] text-[#00ffab]" size={48} />
                 <p className="mt-4 font-bold uppercase tracking-widest text-[#00ffab] text-xs animate-pulse">Generating Animation...</p>
                 <p className="text-xs text-slate-400 mt-2 mx-8 leading-relaxed opacity-60">David is compiling historical quotes and visuals into a cinematic reel.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-[9/16] min-h-[600px] h-[80vh] border border-white/10 rounded-2xl overflow-hidden shadow-2xl mx-auto group bg-slate-950">
            
            {/* AutoPlay Toggle Control */}
            <div className="absolute top-4 right-4 z-50 flex items-center justify-center">
                <button 
                    onClick={() => setIsAutoplaying(!isAutoplaying)}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 hover:border-white/40 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    aria-label={isAutoplaying ? "Pause Auto-scroll" : "Play Auto-scroll"}
                    title={isAutoplaying ? "Pause Autoplay" : "Start Video"}
                >
                    {isAutoplaying ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
                </button>
            </div>

            <div 
                ref={containerRef}
                onScroll={handleScroll}
                className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {script.timeline.map((scene, index) => {
                    let visualSrc = null;
                    if (scene.visual_source === "Flux-Generated" && images?.cora) {
                        visualSrc = images.cora;
                    } else if (scene.visual_source === "Stock-Video" && images?.historical && images.historical !== '') {
                        visualSrc = images.historical;
                    } else if (images?.cora) {
                        visualSrc = images.cora;
                    }

                    const neonColors = ['#00ffab', '#00f3ff', '#ff003c', '#ffb703'];
                    const glowHex = neonColors[index % neonColors.length];
                    const isActive = index === activeIndex;

                    return (
                        <section 
                            key={scene.scene_id}
                            className="w-full h-full snap-start snap-always relative flex flex-col items-center justify-center p-6 overflow-hidden"
                        >
                            {/* Background Visual */}
                            {visualSrc && (
                                <motion.div 
                                    className="absolute inset-0 z-0 origin-center"
                                    initial={{ opacity: 0, scale: 1.15 }}
                                    whileInView={{ opacity: 0.35, scale: 1 }}
                                    viewport={{ amount: 0.5, once: false }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={visualSrc} alt="Scene background" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950" />
                                </motion.div>
                            )}
                            
                            {/* ELEGANT THIN-BORDERED CONTENT CARD */}
                            <motion.div 
                                className="relative z-10 w-full max-w-[90%] border-2 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-slate-950/50 backdrop-blur-md"
                                style={{ borderColor: `${glowHex}80`, boxShadow: `0 0 50px ${glowHex}30` }}
                                initial={{ opacity: 0, y: 80, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ amount: 0.4, once: false }}
                                transition={{ type: "spring", damping: 16, stiffness: 110, mass: 0.9 }}
                            >
                                {/* Accent Neon Bar */}
                                <div className="w-16 h-1 rounded-full mb-6 opacity-80" style={{ background: glowHex, boxShadow: `0 0 10px ${glowHex}` }} />

                                {/* Caption Overlay */}
                                {scene.overlay_text && (
                                    <motion.h2 
                                        className="text-2xl md:text-3xl font-black text-white uppercase leading-tight tracking-wider"
                                        style={{ textShadow: `0 0 15px ${glowHex}80` }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ amount: 0.6 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        {scene.overlay_text}
                                    </motion.h2>
                                )}

                                {/* Detailed Voiceover Quote/Script */}
                                {scene.voiceover_script && (
                                    <motion.div 
                                        className="mt-6 pt-5 border-t border-white/10 w-full"
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ amount: 0.6 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                    >
                                        <p className="text-sm md:text-base text-slate-300 italic font-serif">
                                            &quot;{scene.voiceover_script}&quot;
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Pagination / Scroll Hint */}
                            {index < script.timeline.length - 1 ? (
                                <motion.div 
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-50"
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                >
                                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white/40 to-transparent" />
                                </motion.div>
                            ) : (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-30 text-xs tracking-widest uppercase">
                                    FIN
                                </div>
                            )}

                            {/* Progress bar logic if active and autoplaying */}
                            {isActive && isAutoplaying && (
                                <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full z-50">
                                    <motion.div 
                                        className="h-full bg-white shadow-[0_0_10px_white]"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: scene.duration || 6, ease: "linear" }}
                                    />
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
