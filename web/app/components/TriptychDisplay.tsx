"use client";

import React, { useState } from 'react';
import { BookOpen, History, Play, Search, ArrowRight, X } from 'lucide-react';
import { getCachedWord, saveWordToCache } from '@/lib/store';

/* Types for the Data Structure */
interface Scene {
    scene_index: number;
    video_uri: string;
    prompt: string;
}

export interface EtymologyData {
    word: string;
    breakdown: { part: string; meaning: string; color: string }[];
    literal_meaning: string;
    mnemonic: string;
    root: string;
    root_concept: string;
    story: string;
    visual_subject: string;
    video_prompt?: string;
    video_url?: string;
    image_query: string;
    image_url?: string;
    scenes: Scene[];
}

import InfographicDisplay from './InfographicDisplay';

export default function TriptychDisplay() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<EtymologyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'triptych' | 'infographic'>('triptych');
    const [activeTab, setActiveTab] = useState<'story' | 'history' | 'studio'>('story'); // Mobile Tab State

    const handleSearch = async (term: string) => {
        if (!term) return;
        setLoading(true);
        setError(null);
        setSearchTerm(term); // Update search term
        setData(null); // Clear previous data

        try {
            // 1. Check Cache
            const cached = await getCachedWord(term);
            if (cached) {
                setData(cached.etymology);
                setLoading(false);
                return;
            }

            // 2. Cache Miss - Call API
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: term }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch etymology data');
            }

            const result = await response.json();

            // 3. Save to Cache
            if (result) {
                setData(result);
                saveWordToCache(term, result);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getColorClass = (color: string) => {
        switch (color) {
            case 'red': return 'text-rose-500';
            case 'blue': return 'text-sky-500';
            case 'green': return 'text-emerald-500';
            case 'yellow': return 'text-amber-500';
            default: return 'text-stone-300';
        }
    };

    const getBgColorClass = (color: string) => {
        switch (color) {
            case 'red': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
            case 'blue': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
            case 'green': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'yellow': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            default: return 'bg-stone-800 text-stone-300 border-stone-700';
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-900 selection:text-white">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>

            {/*-- HERO / SEARCH SECTION --*/}
            <div className={`transition-all duration-1000 ease-in-out ${data ? 'h-24 sticky top-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800' : 'h-screen flex items-center justify-center'}`}>
                <div className={`w-full max-w-4xl mx-auto px-6 flex ${data ? 'flex-row items-center justify-between' : 'flex-col items-center gap-8'}`}>

                    <h1 className={`font-serif text-amber-500 tracking-tight transition-all duration-700 ${data ? 'text-2xl' : 'text-5xl md:text-7xl'}`}>
                        Le Mot Clef
                    </h1>

                    <div className={`relative transition-all duration-700 ${data ? 'w-full max-w-md ml-8' : 'w-full max-w-xl'}`}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                            placeholder="Enter a word (e.g. Bureau, Canapé)..."
                            className="w-full bg-stone-900/50 border border-stone-700 rounded-full px-6 py-4 text-stone-200 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-serif placeholder:italic placeholder:text-stone-600"
                        />
                        <button
                            onClick={() => handleSearch(searchTerm)}
                            disabled={loading}
                            className="absolute right-2 top-2 bg-amber-700 hover:bg-amber-600 text-stone-100 p-2 rounded-full transition-colors disabled:opacity-50"
                        >
                            {loading ? <div className="animate-spin h-5 w-5 border-2 border-stone-300 border-t-transparent rounded-full" /> : <ArrowRight size={20} />}
                        </button>
                    </div>
                    {error && <div className="text-rose-500 font-mono text-sm mt-4 bg-rose-950/30 px-4 py-2 rounded mb-4">{error}</div>}
                </div>
            </div>

            {/*-- MAIN CONTENT TRIPTYCH or INFOGRAPHIC --*/}
            {data && (
                <main className="max-w-[1600px] mx-auto p-6 h-[calc(100vh-6rem)] relative z-0">

                    <div className="absolute top-0 right-6 z-50 flex gap-2">
                        <div className="bg-stone-900 rounded-full p-1 border border-stone-800 flex shadow-lg">
                            <button
                                onClick={() => setViewMode('triptych')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'triptych' ? 'bg-amber-700 text-white shadow' : 'text-stone-500 hover:text-stone-300'}`}
                            >
                                Interactive
                            </button>
                            <button
                                onClick={() => setViewMode('infographic')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'infographic' ? 'bg-stone-200 text-stone-900 shadow' : 'text-stone-500 hover:text-stone-300'}`}
                            >
                                Infographic
                            </button>
                        </div>
                    </div>

                    {viewMode === 'infographic' ? (
                        <div className="h-full pt-12 animate-in fade-in zoom-in-95 duration-500">
                            <InfographicDisplay data={data} />
                        </div>
                    ) : (
                        <>
                            {/* Mobile Tabs */}
                            <div className="md:hidden flex gap-4 mb-6 border-b border-stone-800 pb-2">
                                {['story', 'history', 'studio'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`uppercase tracking-widest text-xs font-bold pb-2 ${activeTab === tab ? 'text-amber-500 border-b-2 border-amber-500' : 'text-stone-500'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pt-12">
                                {/* PANEL 1: THE NARRATIVE (Clédor) */}
                                <section className={`bg-stone-900/40 border border-stone-800 rounded-xl p-8 overflow-y-auto ${activeTab === 'story' ? 'block' : 'hidden md:block'}`}>
                                    <div className="flex items-center gap-3 mb-6 text-amber-600">
                                        <BookOpen size={20} />
                                        <h2 className="uppercase tracking-widest text-xs font-bold">L'Étymologiste</h2>
                                    </div>

                                    {/* BIONIC ETYMOLOGY DISPLAY */}
                                    <div className="mb-8 p-6 bg-stone-950 border border-stone-800 rounded-lg shadow-inner">
                                        <div className="flex flex-wrap items-baseline gap-1 mb-4">
                                            {data.breakdown && data.breakdown.length > 0 ? (
                                                data.breakdown.map((part, idx) => (
                                                    <span key={idx} className={`text-4xl md:text-5xl font-black tracking-tight ${getColorClass(part.color)}`}>
                                                        {part.part}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-4xl md:text-5xl font-black text-stone-100">{data.word}</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {data.breakdown && data.breakdown.map((part, idx) => (
                                                <div key={idx} className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getBgColorClass(part.color)}`}>
                                                    {part.meaning}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-stone-800 pt-4">
                                            <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Literal Meaning</p>
                                            <p className="text-xl font-serif italic text-stone-300">"{data.literal_meaning}"</p>
                                        </div>
                                    </div>

                                    {/* MNEMONIC CARD */}
                                    <div className="mb-8 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                                        <p className="text-amber-500 text-xs uppercase tracking-wider font-bold mb-2">🧠 Visual Mnemonic</p>
                                        <p className="text-lg font-medium text-amber-200">"{data.mnemonic}"</p>
                                    </div>

                                    <div className="prose prose-invert prose-lg text-stone-300 font-serif leading-relaxed">
                                        <p>{data.story}</p>
                                    </div>
                                </section>

                                {/* PANEL 2: THE ARCHIVE (Cora) */}
                                <section className={`bg-stone-900/40 border border-stone-800 rounded-xl p-8 overflow-y-auto flex flex-col ${activeTab === 'history' ? 'block' : 'hidden md:flex'}`}>
                                    <div className="flex items-center gap-3 mb-6 text-emerald-700">
                                        <History size={20} />
                                        <h2 className="uppercase tracking-widest text-xs font-bold">L'Archiviste</h2>
                                    </div>

                                    <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
                                        {/* Visual Contrast / Root Image */}
                                        <div className="w-full aspect-[4/5] bg-stone-800 rounded-lg overflow-hidden relative group shadow-2xl border border-stone-700">
                                            {/* Real Historical Image */}
                                            {data.image_url ? (
                                                <img
                                                    src={data.image_url}
                                                    alt={data.visual_subject}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-stone-600 bg-stone-900">
                                                    <span className="italic">No image found for {data.root}</span>
                                                </div>
                                            )}

                                            {/* Overlay Info */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                                            <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                                                <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">The origin</p>
                                                <p className="text-white font-serif text-2xl leading-none mb-2">{data.root}</p>
                                                <p className="text-stone-300 text-sm italic">{data.visual_subject}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-sm text-stone-500 max-w-xs">
                                            <p>This is the physical object that gave birth to the abstract word <span className="text-stone-300">{data.word}</span>.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* PANEL 3: THE STUDIO (Video) */}
                                <section className={`bg-black border border-stone-800 rounded-xl overflow-hidden relative ${activeTab === 'studio' ? 'block' : 'hidden md:block'}`}>
                                    {/* Video Overlay UI */}
                                    <div className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                                        <div className="flex items-center gap-2 text-rose-500">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                            <h2 className="uppercase tracking-widest text-xs font-bold">Le Studio</h2>
                                        </div>
                                    </div>

                                    {/* Video Stack (Scrollable Snap) */}
                                    <div className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                                        {data.scenes.map((scene, idx) => (
                                            <div key={idx} className="h-full w-full snap-center relative bg-stone-900 flex items-center justify-center border-b border-stone-800/30">
                                                <div className="text-center p-6">
                                                    <p className="text-stone-500 text-xs uppercase mb-2">Scene 0{idx + 1}</p>
                                                    <p className="font-serif text-lg text-stone-300 max-w-xs mx-auto">
                                                        {scene.prompt.substring(0, 50)}...
                                                    </p>
                                                    <div className="mt-8 w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center mx-auto opacity-50">
                                                        <Play size={20} fill="currentColor" />
                                                    </div>
                                                </div>
                                                {/* Real Video will be an <video> tag here */}
                                                {scene.video_uri && (
                                                    <video
                                                        src={scene.video_uri}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        loop
                                                        muted
                                                        playsInline
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                            </div>
                        </>
                    )}
                </main>
            )}
        </div>
    );
}
