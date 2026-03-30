"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EtymologyData, VideoScript } from '@/lib/types';
import { BookOpen, Clock } from 'lucide-react';
import ScrollInfographicPanel from './ScrollInfographicPanel';
import { useLanguage } from '../context/LanguageContext';

interface ResultsDashboardProps {
    data: EtymologyData;
}

export default function ResultsDashboard({ data }: ResultsDashboardProps) {
    const { t } = useLanguage();
    const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
    const [videoLoading, setVideoLoading] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Auto-Trigger the Video Director (Infographic Builder)
    useEffect(() => {
        if (!videoScript && !videoLoading) {
            handleGenerateVideo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGenerateVideo = async () => {
        setVideoLoading(true);
        try {
            const response = await fetch('/api/director', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    word: data.meta.word,
                    cledor: data, // Pass full analysis
                    cora: data.cora // Pass visual assets
                })
            });

            if (!response.ok) throw new Error("Director failed to generate script");

            const script = await response.json();
            setVideoScript(script);
        } catch (error) {
            console.error("Video Generation Error:", error);
        } finally {
            setVideoLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-start">
                
                {/* LEFT SIDE (2/3 width) - Definition & Timeline */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                    className="lg:col-span-2 flex flex-col gap-6"
                >
                    {/* 1. Definition Card */}
                    <div className="bg-etymo-card border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen size={120} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-4 mb-2 flex-wrap">
                                <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary capitalize break-words neon-text">
                                    {data.meta.word}
                                </h1>
                                <span className="text-accent-cyan text-lg font-mono tracking-wider">
                                    {data.root_analysis.root}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-bg-navy border border-white/10 rounded text-xs font-bold uppercase tracking-wider text-text-secondary">
                                    {/* @ts-expect-error - Dynamic key access */}
                                    {t.dashboard.pos?.[data.meta.part_of_speech.toLowerCase()] || data.meta.part_of_speech}
                                </span>
                                <span className="px-3 py-1 bg-bg-navy border border-white/10 rounded text-xs font-bold tracking-wider text-text-secondary font-mono">
                                    {data.meta.ipa}
                                </span>
                                <span className="px-3 py-1 bg-bg-midnight border border-accent-cyan/30 rounded text-xs font-bold uppercase tracking-wider text-accent-cyan shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                                    {t.dashboard.concept} <span className="text-white">{data.root_analysis.concept}</span>
                                </span>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm uppercase tracking-widest text-slate-500 mb-1">{t.dashboard.originalMeaning}</p>
                                <p className="text-xl text-white font-serif italic">&quot;{data.root_analysis.original_meaning}&quot;</p>
                            </div>

                            <div className="prose prose-invert max-w-none border-t border-slate-800 pt-4">
                                <p className="text-lg text-slate-300 leading-relaxed font-light">
                                    {data.semantic_soul.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Timeline Widget (Evolution) */}
                    <div className="bg-etymo-card border border-white/10 rounded-2xl p-6 overflow-hidden">
                        <div className="flex items-center gap-2 mb-6 text-text-secondary">
                            <Clock size={20} />
                            <h2 className="text-sm font-bold uppercase tracking-widest">{t.dashboard.evolutionTitle.replace('{{word}}', data.meta.word)}</h2>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative pl-4 md:pl-0">
                                <div className="hidden md:block absolute top-[18px] left-0 right-0 h-0.5 bg-slate-800 -z-0"></div>
                                <div className="md:hidden absolute top-0 bottom-0 left-[21px] w-0.5 bg-slate-800 -z-0"></div>

                                {data.narrative_chronology.map((era, idx) => {
                                    const getLocalizedEra = (eraString: string) => {
                                        const lower = eraString.toLowerCase();
                                        if (lower.includes('ancient') || lower.includes('antiquity') || lower.includes('latin') || lower.includes('root')) return t.dashboard.eras?.ancient || eraString;
                                        if (lower.includes('middle') || lower.includes('medieval') || lower.includes('french')) return t.dashboard.eras?.middle_ages || eraString;
                                        if (lower.includes('modern') || lower.includes('today') || lower.includes('present')) return t.dashboard.eras?.modern || eraString;
                                        return eraString;
                                    };

                                    return (
                                        <div key={idx} className="relative z-10 flex flex-col md:items-center md:text-center gap-3 p-4 bg-slate-900/50 md:bg-transparent rounded-lg md:rounded-none border md:border-none border-slate-800 ml-4 md:ml-0">
                                            <div className="flex items-center gap-4 md:flex-col md:gap-2 absolute -left-[27px] top-4 md:static">
                                                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 shrink-0 ${idx === data.narrative_chronology.length - 1 ? 'bg-etymo-primary border-etymo-accent shadow-[0_0_10px_#06b6d4]' : 'bg-slate-900 border-slate-500'}`}></div>
                                                <span className="text-xs font-bold uppercase text-etymo-accent hidden md:block">{getLocalizedEra(era.era)}</span>
                                            </div>

                                            <span className="text-xs font-bold uppercase text-etymo-accent md:hidden mb-1 block">{getLocalizedEra(era.era)}</span>

                                            <div>
                                                <p className="text-lg font-bold text-white mb-1">{era.form}</p>
                                                <p className="text-sm text-slate-400 italic mb-2">&quot;{era.meaning}&quot;</p>
                                                <p className="text-xs text-slate-500 leading-relaxed text-left md:text-center">
                                                    {era.story}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE (1/3 width) - Scrollable Infographic Panel */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.6 }}
                    className="lg:col-span-1 sticky top-8"
                >
                    <ScrollInfographicPanel 
                        script={videoScript}
                        images={{ cora: data.image_url || '', historical: data.cora?.historical_image || null }}
                        loading={videoLoading}
                    />
                </motion.div>

            </div>
        </div>
    );
}
