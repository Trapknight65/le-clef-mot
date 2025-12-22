"use client";

import React, { useState } from 'react';
import { BookOpen, History, Play, Pause, Search, ArrowRight, X } from 'lucide-react';

/* Types for the Data Structure */
interface Scene {
    scene_index: number;
    video_uri: string;
    prompt: string;
}

export interface EtymologyData {
    word: string;
    root: string;
    root_concept: string;
    story: string;
    visual_subject: string;
    image_query: string;
    image_url?: string; // New field from SerpAPI
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

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setError(null);
        setData(null); // Clear previous results

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word: searchTerm }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
        } catch (err: any) {
            console.error("Search failed:", err);
            setError(err.message || "Failed to fetch data.");
        } finally {
            setLoading(false);
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
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter a word (e.g. Bureau, Canapé)..."
                            className="w-full bg-stone-900/50 border border-stone-700 rounded-full px-6 py-4 text-stone-200 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all font-serif placeholder:italic placeholder:text-stone-600"
                        />
                        <button
                            onClick={handleSearch}
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

                    {/* View Switcher - Always visible in headers for Desktop, or floating for Mobile? 
                        Let's put it top-right relative to main container for now. 
                    */}
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

                                    <h3 className="font-serif text-3xl md:text-4xl text-stone-100 mb-6 leading-tight">
                                        The hidden history of <span className="text-amber-500 italic">{data.word}</span>
                                    </h3>

                                    <div className="prose prose-invert prose-lg text-stone-300 font-serif leading-relaxed">
                                        <p>{data.story}</p>
                                        <p className="mt-4">
                                            We often forget that abstract words started as concrete objects.
                                            Before it was a concept, it was something you could touch, hold, or use.
                                        </p>
                                    </div>

                                    <div className="mt-12 p-6 bg-stone-950/50 rounded-lg border border-stone-800/50">
                                        <h4 className="text-stone-500 text-xs uppercase tracking-wider mb-2">Semantic Pivot</h4>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                                                <span className="text-stone-400">Target</span>
                                                <span className="font-serif text-xl">{data.word}</span>
                                            </div>
                                            <div className="flex justify-center text-amber-700 py-1">↓</div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-stone-400">Roots</span>
                                                <span className="font-serif text-xl text-amber-200">{data.root}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* PANEL 2: THE ARCHIVE (Cora) */}
                                <section className={`bg-stone-900/40 border border-stone-800 rounded-xl p-8 overflow-y-auto flex flex-col ${activeTab === 'history' ? 'block' : 'hidden md:flex'}`}>
                                    <div className="flex items-center gap-3 mb-6 text-emerald-700">
                                        <History size={20} />
                                        <h2 className="uppercase tracking-widest text-xs font-bold">L'Archiviste</h2>
                                    </div>

                                    <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-full aspect-[4/5] bg-stone-800 rounded-lg overflow-hidden relative group">
                                            {/* Real Historical Image */}
                                            {data.image_url ? (
                                                <img
                                                    src={data.image_url}
                                                    alt={data.visual_subject}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-stone-600 bg-stone-900">
                                                    <span className="italic">No image found for {data.root}</span>
                                                </div>
                                            )}
                                            {/* Overlay Info */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                <p className="text-white font-serif text-lg">{data.visual_subject}</p>
                                                <p className="text-stone-400 text-xs font-mono">{data.image_query}</p>
                                            </div>
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
