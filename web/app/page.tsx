"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import ParticleBackground from './components/effects/ParticleBackground';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    // Navigate to the dynamic route
    const slug = term.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    router.push(`/mot/${slug}`);
  };

  return (
    <main className="min-h-screen bg-etymo-bg text-slate-100 flex flex-col font-sans selection:bg-etymo-primary selection:text-white overflow-x-hidden relative">

      {/* BACKGROUND EFFECTS */}
      <ParticleBackground />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse-glow" />
      </div>

      {/* NAV / HEADER (Minimalist) */}
      <header className="relative z-20 w-full p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-slate-800/50 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
            <span className="font-serif font-bold text-xl text-etymo-accent">M</span>
          </div>
          <span className="font-medium text-lg tracking-wide text-white/80 group-hover:text-white transition-colors">Le Mot Clef</span>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/40 border border-white/10 backdrop-blur-md text-xs font-medium text-etymo-accent mb-10 shadow-lg hover:bg-slate-800/60 transition-colors cursor-default"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>AI-Powered Etymology Engine</span>
          </motion.div>

          {/* Majestic Title */}
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-white drop-shadow-2xl leading-[0.85] text-balance">
            <span className="block bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">Uncover the Soul</span>
            <span className="block text-3xl md:text-6xl lg:text-7xl font-serif italic text-slate-500 mt-2 md:mt-4 opacity-80">of every word</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed text-balance">
            A cinematic journey through the hidden history, visual roots, and semantic evolution of language.
          </p>

          {/* SEARCH PORTAL */}
          <div className={`w-full max-w-2xl relative group mx-auto transition-all duration-500 ${isFocused ? 'scale-105 z-30' : 'z-10'}`}>

            {/* Dimming Overlay when focused */}
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[-1] pointer-events-none transition-opacity duration-500"
              />
            )}

            <div className="absolute -inset-1 bg-gradient-to-r from-etymo-primary via-etymo-accent to-etymo-primary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse-glow"></div>

            <div className={`relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-3 shadow-2xl transition-all duration-300 ${isFocused ? 'bg-slate-900/90 border-etymo-accent/30 ring-1 ring-etymo-accent/20' : 'hover:border-white/20'}`}>

              <div className="pl-4 pr-3 text-slate-400">
                <Search size={24} className={`${isFocused ? 'text-etymo-accent' : ''} transition-colors`} />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                placeholder="Enter a word to reveal its story..."
                className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-3 py-4 text-xl md:text-2xl font-medium h-16 w-full outline-none"
              />

              <button
                onClick={() => handleSearch(searchTerm)}
                disabled={loading || !searchTerm.trim()}
                className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center aspect-square"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
              </button>
            </div>
          </div>

          {/* TRENDING TOKENS */}
          <div className={`mt-16 flex flex-col items-center gap-4 transition-opacity duration-300 ${isFocused ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
            <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-2">Curated Journeys</span>
            <div className="flex flex-wrap justify-center gap-3">
              {['Lumière', 'Silence', 'Labyrinthe', 'Écho', 'Aurore'].map((w, i) => {
                const slug = w.toLowerCase().replace(/[^a-z0-9]/g, '-');
                return (
                  <Link
                    key={w}
                    href={`/mot/${slug}`}
                  >
                    <motion.div
                      whileHover={{ y: -5, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 backdrop-blur-sm text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 flex items-center gap-2"
                    >
                      <BookOpen size={14} className="opacity-50" />
                      <span className="font-medium">{w}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER ACCENT */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />

    </main>
  );
}
