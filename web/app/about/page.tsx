'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Sparkles, Database, History } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '../components/effects/ParticleBackground';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Header from '../components/Header';

export default function About() {
    const { t, language } = useLanguage();
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Detect reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', motionHandler);

        return () => {
            mediaQuery.removeEventListener('change', motionHandler);
        };
    }, []);

    return (
        <main className="min-h-screen bg-bg-navy text-text-primary relative overflow-hidden">
            <ParticleBackground />

            {/* Header */}
            <Header variant="inner" backLink={{ href: '/', type: 'default' }} />

            {/* Hero */}
            <section className="relative z-10 py-20 px-6 text-center border-b border-white/10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel neon-box-cyan text-xs font-medium mb-8"
                        role="status"
                        aria-label={t.about.badge}
                    >
                        <History size={12} aria-hidden="true" />
                        <span>{t.about.badge}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                        className="text-5xl md:text-7xl font-black mb-4 neon-text animate-neon-flicker"
                    >
                        {t.about.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0.01 : 0.5 }}
                        className="text-xl text-text-secondary italic"
                    >
                        {t.about.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Mission */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 neon-text-cyan">{t.about.mission.title}</h2>
                    <p className="text-lg text-text-secondary leading-relaxed">{t.about.mission.text}</p>
                </div>
            </section>

            {/* Approach */}
            <section className="relative z-10 py-16 px-6 bg-bg-midnight/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 neon-text-cyan">{t.about.approach.title}</h2>
                    <p className="text-lg text-text-secondary leading-relaxed">{t.about.approach.text}</p>
                </div>
            </section>

            {/* AI Agents */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center neon-text">{t.about.agents.title}</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Cledor */}
                        <motion.div
                            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                            className="glass-panel-neon p-8 rounded-xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Brain className="w-8 h-8 neon-text-cyan" aria-hidden="true" />
                                <div>
                                    <h3 className="text-2xl font-bold neon-text-cyan">{t.about.agents.cledor.name}</h3>
                                    <p className="text-sm text-text-tertiary">{t.about.agents.cledor.role}</p>
                                </div>
                            </div>
                            <p className="text-text-secondary leading-relaxed">{t.about.agents.cledor.description}</p>
                        </motion.div>

                        {/* Cora */}
                        <motion.div
                            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                            className="glass-panel-neon p-8 rounded-xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-8 h-8 neon-text-magenta" aria-hidden="true" />
                                <div>
                                    <h3 className="text-2xl font-bold neon-text-magenta">{t.about.agents.cora.name}</h3>
                                    <p className="text-sm text-text-tertiary">{t.about.agents.cora.role}</p>
                                </div>
                            </div>
                            <p className="text-text-secondary leading-relaxed">{t.about.agents.cora.description}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="relative z-10 py-16 px-6 bg-bg-midnight/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 neon-text">{t.about.team.title}</h2>
                    <p className="text-lg text-text-secondary leading-relaxed">{t.about.team.text}</p>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 py-20 px-6 text-center border-t border-white/10">
                <Link href="/" className="neon-button inline-block active:scale-95 transition-transform" aria-label={t.about.cta}>
                    <BookOpen className="inline w-5 h-5 mr-2" aria-hidden="true" />
                    {t.about.cta}
                </Link>
            </section>
        </main>
    );
}
