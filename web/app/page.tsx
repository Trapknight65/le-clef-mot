"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { EtymologyData } from '@/lib/types';
import ResultsDashboard from './components/ResultsDashboard';
import ParticleBackground from './components/effects/ParticleBackground';
import { getCachedWord, saveWordToCache } from '@/lib/store';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EtymologyData | null>(null);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setData(null);

    // 1. Check Cache
    try {
      const cached = await getCachedWord(term);
      if (cached) {
        console.log("Cache Hit:", cached.slug);
        setData(cached.etymology);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Cache Read Error", e);
    }

    // 2. Fetch API
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: term })
      });

      if (!response.ok) throw new Error("Search failed");

      const result: EtymologyData = await response.json();
      setData(result);

      // 3. Save to Cache (Async)
      saveWordToCache(term, result);

    } catch (error) {
      console.error("Search Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-etymo-bg text-slate-100 flex flex-col font-sans selection:bg-etymo-primary selection:text-white overflow-x-hidden">

      {/* BACKGROUND EFFECTS */}
      <ParticleBackground />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-transparent" />
      </div>

      {/* NAV / HEADER */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-etymo-primary to-etymo-accent rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-serif font-bold text-lg text-white">M</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Le Mot Clef</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Methodology</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </nav>
      </header>

      {/* HERO SECTION (Visible when no data) */}
      <AnimatePresence mode='wait'>
        {!data && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
            className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-etymo-accent mb-8">
              <Sparkles size={12} />
              <span>Powered by Bytez AI Models</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-[0.9]">
              Uncover the Soul <br /> of French Words
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Discover the hidden history, visual roots, and semantic journey of any word.
              From Latin origins to modern metaphor.
            </p>

            {/* SEARCH INPUT */}
            <div className="w-full max-w-xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-etymo-primary to-etymo-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-etymo-bg border border-slate-700 rounded-full flex items-center p-2 shadow-2xl">
                <Search className="ml-4 text-slate-500" size={24} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                  placeholder="Try searching for 'Amour', 'Travail'..."
                  className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 px-4 py-2 text-lg h-12"
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  disabled={loading}
                  className="bg-etymo-primary hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Analyze <ArrowRight size={18} /></>}
                </button>
              </div>
            </div>

            {/* EXAMPLES */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span>Trending:</span>
              {['Cœur', 'Lumière', 'Rêve', 'Liberté'].map(w => (
                <button key={w} onClick={() => { setSearchTerm(w); handleSearch(w); }} className="text-slate-300 hover:text-etymo-accent underline underline-offset-4 decoration-slate-700 hover:decoration-etymo-accent transition-all">
                  {w}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULTS DASHBOARD */}
        {data && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 w-full flex-grow flex flex-col"
          >
            {/* Mini Search Header (Sticky) */}
            <div className="sticky top-0 z-50 bg-etymo-bg/80 backdrop-blur-md border-b border-slate-800 p-4">
              <div className="max-w-7xl mx-auto flex items-center gap-4">
                <button onClick={() => setData(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                  <span className="font-bold">← Back</span>
                </button>
                <div className="flex-grow max-w-md relative">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-etymo-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <ResultsDashboard data={data} />
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
