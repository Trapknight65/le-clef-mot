"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EtymologyData, VideoScript } from '@/lib/types';
import { BookOpen, Clock, Zap, Network, ChevronRight } from 'lucide-react';
import VideoPlayerWrapper from './video/VideoPlayerWrapper';
import TextScramble from './effects/TextScramble';

interface ResultsDashboardProps {
    data: EtymologyData;
}

export default function ResultsDashboard({ data }: ResultsDashboardProps) {
    const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
    const [videoLoading, setVideoLoading] = useState(false);

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
            alert("David (The Director) is on a coffee break. Try again.");
        } finally {
            setVideoLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            {/* Header: Word & Definition */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* 1. Definition Card (Main Info) */}
                <div className="col-span-1 lg:col-span-2 bg-etymo-card border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BookOpen size={120} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-baseline gap-4 mb-2">
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent capitalize">
                                {data.meta.word}
                            </h1>
                            <span className="text-etymo-accent text-lg font-mono tracking-wider">
                                {data.root_analysis.root}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold uppercase tracking-wider text-slate-400">
                                {data.meta.part_of_speech}
                            </span>
                            <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold tracking-wider text-slate-400 font-mono">
                                {data.meta.ipa}
                            </span>
                            <span className="px-3 py-1 bg-blue-900/30 border border-blue-800 rounded text-xs font-bold uppercase tracking-wider text-blue-300">
                                Concept: <span className="text-white">{data.root_analysis.concept}</span>
                            </span>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm uppercase tracking-widest text-slate-500 mb-1">Original Meaning</p>
                            <p className="text-xl text-white font-serif italic">"{data.root_analysis.original_meaning}"</p>
                        </div>

                        <div className="prose prose-invert max-w-none border-t border-slate-800 pt-4">
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                {data.semantic_soul.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Visual Context Card (RAG/Cledor Image) */}
                <div className="col-span-1 bg-etymo-card border border-slate-800 rounded-2xl overflow-hidden relative min-h-[300px] group">
                    {data.image_url ? (
                        <>
                            <img
                                src={data.image_url}
                                alt="Visual Origin"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                            />

                            {/* Cora's Commentary Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent p-6 pt-12">
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-etymo-accent text-slate-900 flex items-center justify-center font-bold text-xs shrink-0 shadow-lg shadow-cyan-500/20">
                                        C
                                    </div>
                                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-r-xl rounded-bl-xl p-3 border border-slate-700">
                                        <p className="text-xs text-etymo-accent font-bold uppercase tracking-widest mb-1">Cora (Visual Archivist)</p>
                                        <p className="text-sm text-slate-200 italic leading-snug">
                                            "{data.cora?.curator_comment || data.visual_prompt}"
                                        </p>
                                    </div>
                                </div>

                                {/* Metadata / Type of Image */}
                                <div className="flex justify-between items-end mt-2 opacity-50 text-[10px] uppercase tracking-wider">
                                    <span>{data.cora?.generated_image ? 'Generative (Flux)' : 'Historical Archive'}</span>
                                    {data.cora?.serp_search && <span>Sources Checked: {data.cora.serp_search.queries?.length}</span>}
                                </div>
                            </div>

                            {/* Historical Reference Button (e.g. if we have both) */}
                            {data.cora?.historical_image && (
                                <div className="absolute top-4 right-4">
                                    <div className="w-12 h-12 rounded-lg border-2 border-slate-600 bg-slate-900 overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-help" title="Historical Reference">
                                        <img src={data.cora.historical_image} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            No Visual Data
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Middle Row: Timeline & Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 3. Timeline Widget (Evolution) */}
                <div className="col-span-1 lg:col-span-2 bg-etymo-card border border-slate-800 rounded-2xl p-6 overflow-hidden">
                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                        <Clock size={20} />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Evolution Timeline</h3>
                    </div>

                    <div className="relative">
                        {/* Vertical line for mobile, horizontal for desktop? Lets do simple vertical stack for robustness or horizontal grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-[18px] left-0 right-0 h-0.5 bg-slate-800 -z-0"></div>

                            {data.narrative_chronology.map((era, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col md:items-center md:text-center gap-3 p-4 bg-slate-900/50 md:bg-transparent rounded-lg md:rounded-none border md:border-none border-slate-800">
                                    <div className="flex items-center gap-3 md:flex-col md:gap-2">
                                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 ${idx === data.narrative_chronology.length - 1 ? 'bg-etymo-primary border-etymo-accent shadow-[0_0_10px_#06b6d4]' : 'bg-slate-700 border-slate-500'}`}></div>
                                        <span className="text-xs font-bold uppercase text-etymo-accent">{era.era}</span>
                                    </div>

                                    <div>
                                        <p className="text-lg font-bold text-white mb-1">{era.form}</p>
                                        <p className="text-sm text-slate-400 italic mb-2">"{era.meaning}"</p>
                                        <p className="text-xs text-slate-500 leading-relaxed text-left md:text-center">
                                            {era.story}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Mnemonic / Quick Fact */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-slate-800 transition-colors group-hover:text-slate-800/50">
                        <Network size={100} />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Cognitive Link</h3>
                        <TextScramble
                            text={`"${data.semantic_soul.mnemonic}"`}
                            className="text-lg font-medium text-etymo-accent italic mb-4 min-h-[60px]"
                        />

                        {/* Video Generation Trigger */}
                        <div className="border-t border-slate-800 pt-4 mt-4">
                            <button
                                onClick={() => handleGenerateVideo()}
                                disabled={videoLoading || !!videoScript}
                                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-lg font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                            >
                                {videoLoading ? (
                                    <>Generating Script...</>
                                ) : videoScript ? (
                                    <>Watch Video Below ↓</>
                                ) : (
                                    <>🎬 Generate Viral Video</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* VIDEO PLAYER SECTION */}
            {videoScript && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col items-center mt-12 bg-slate-900/50 p-8 rounded-3xl border border-slate-800"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-white mb-2">{videoScript.video_meta.title}</h2>
                        <p className="text-slate-400">Duration: {videoScript.video_meta.total_duration}s • Mood: {videoScript.video_meta.bg_music_mood}</p>
                    </div>

                    <div className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden border-4 border-slate-700">
                        <VideoPlayerWrapper
                            script={videoScript}
                            images={{
                                cora: data.image_url || '', // Flux
                                historical: data.cora?.historical_image || null // Serp
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
