"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import ParticleBackground from './components/effects/ParticleBackground';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingWeaver from './components/LoadingWeaver';
import LanguageToggle from './components/LanguageToggle';
import Header from './components/Header';
import Image from 'next/image';

import { useLanguage } from './context/LanguageContext';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  // Detect reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    // Navigate to the dynamic route
    const slug = term.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    router.push(`/mot/${slug}`);
  };

  return (
    <main className="min-h-screen text-text-primary flex flex-col font-sans selection:bg-neon-yellow selection:text-bg-navy overflow-x-hidden relative">
      <AnimatePresence>
        {loading && <LoadingWeaver />}
      </AnimatePresence>

      {/* BACKGROUND EFFECTS */}
      <ParticleBackground />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-navy/50 to-bg-navy" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-neon-yellow/5 rounded-full blur-[120px] opacity-20 animate-pulse-glow" />
      </div>

      {/* NAV / HEADER (Neon branding) */}
      <Header variant="home" />

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
            transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0.01 : 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel neon-box-cyan text-xs font-medium neon-text-cyan mb-8 hover-glow cursor-default"
            role="status"
            aria-label="AI-Powered Etymology Engine"
          >
            <Sparkles size={12} className="animate-neon-pulse" />
            <span>AI-Powered Etymology Engine</span>
          </motion.div>

          {/* Majestic Title */}
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 drop-shadow-2xl leading-[0.85] text-balance">
            <span className="block neon-text animate-neon-flicker">{t.homepage.title}</span>
            <span className="block text-3xl md:text-6xl lg:text-7xl font-serif italic text-text-secondary mt-2 md:mt-4">{t.homepage.subtitle}</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-16 leading-relaxed text-balance">
            {t.homepage.description}
          </p>

          {/* SEARCH PORTAL */}
          <div className={`w-full max-w-2xl relative group mx-auto transition-all duration-500 ${isFocused ? 'scale-105 z-30' : 'z-10'}`} role="search">
            {/* Screen reader instructions */}
            <span id="search-instructions" className="sr-only">
              Enter a word and press Enter or click the search button to explore its etymology
            </span>

            {/* Dimming Overlay when focused */}
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-bg-navy/80 backdrop-blur-sm z-[-1] pointer-events-none transition-opacity duration-500"
              />
            )}

            <div className="absolute -inset-1 bg-gradient-to-r from-neon-yellow via-accent-cyan to-neon-yellow rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse-glow"></div>

            <div className={`relative bg-bg-midnight/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-3 shadow-2xl transition-all duration-300 ${isFocused ? 'bg-bg-midnight/90 border-neon-yellow/30 ring-1 ring-neon-yellow/20' : 'hover:border-white/20'}`}>

              <div className="pl-4 pr-3 text-text-secondary">
                <Search size={24} className={`${isFocused ? 'text-neon-yellow' : ''} transition-colors`} />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                placeholder={t.homepage.searchPlaceholder}
                aria-label="Search for word etymology"
                aria-describedby="search-instructions"
                className="flex-grow bg-transparent border-none focus:ring-0 text-text-primary placeholder-text-tertiary px-3 py-4 text-xl md:text-2xl font-medium h-16 w-full outline-none"
              />

              <button
                onClick={() => handleSearch(searchTerm)}
                disabled={loading || !searchTerm.trim()}
                aria-label={loading ? "Searching etymology..." : "Search for word etymology"}
                className="bg-white/10 hover:bg-white/20 active:scale-95 active:opacity-90 text-neon-yellow p-4 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center aspect-square"
              >
                {loading ? <Loader2 className="animate-spin" size={24} aria-hidden="true" /> : <ArrowRight size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className={`mt-16 flex flex-col items-center gap-4 transition-opacity duration-300 ${isFocused ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
            <span className="text-xs uppercase tracking-widest text-text-tertiary font-semibold mb-2">{t.homepage.curated_title}</span>
            <div className="flex flex-wrap justify-center gap-4">
              {['Lumière', 'Silence', 'Labyrinthe', 'Écho', 'Aurore'].map((w, i) => {
                const slug = w.toLowerCase().replace(/[^a-z0-9]/g, '-');
                return (
                  <Link
                    key={w}
                    href={`/mot/${slug}`}
                    aria-label={`Explore etymology of ${w}`}
                  >
                    <motion.div
                      whileHover={{ y: -5, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="px-6 py-3 rounded-lg bg-bg-midnight/50 hover:bg-bg-midnight border border-white/5 hover:border-neon-yellow/50 backdrop-blur-sm text-text-secondary hover:text-neon-yellow transition-all cursor-pointer shadow-lg hover:shadow-neon-yellow/10 flex items-center gap-2"
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
