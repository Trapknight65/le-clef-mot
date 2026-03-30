'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Workflow, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ParticleBackground from '../components/effects/ParticleBackground';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import Header from '../components/Header';

export default function Methodology() {
    const { t } = useLanguage();
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
                        aria-label={t.methodology.badge}
                    >
                        <Workflow size={12} aria-hidden="true" />
                        <span>{t.methodology.badge}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
                        className="text-5xl md:text-7xl font-black mb-4 neon-text animate-neon-flicker"
                    >
                        {t.methodology.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0.01 : 0.5 }}
                        className="text-xl text-text-secondary max-w-3xl mx-auto"
                    >
                        {t.methodology.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Intro */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-text-secondary leading-relaxed text-center">{t.methodology.intro}</p>
                </div>
            </section>

            {/* Workflow Steps */}
            <section className="relative z-10 py-16 px-6 bg-bg-midnight/30">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center neon-text">{t.methodology.workflow.title}</h2>

                    <div className="space-y-12">
                        {t.methodology.workflow.steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: prefersReducedMotion ? 0 : i * 0.2, duration: prefersReducedMotion ? 0.01 : 0.5 }}
                                className="glass-panel-neon p-8 rounded-xl"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="neon-text text-5xl font-black opacity-30">{step.number}</div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold neon-text-cyan mb-2">{step.title}</h3>
                                        <p className="text-sm text-text-tertiary mb-4">{step.agent}</p>
                                        <p className="text-text-secondary mb-6">{step.description}</p>
                                        <ul className="space-y-2">
                                            {step.details.map((detail, j) => (
                                                <li key={j} className="flex items-start gap-3 text-sm text-text-secondary">
                                                    <ArrowRight className="w-4 h-4 mt-0.5 text-neon-cyan flex-shrink-0" aria-hidden="true" />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 neon-text-cyan flex items-center gap-3 justify-center">
                        <Database className="w-8 h-8" aria-hidden="true" />
                        {t.methodology.tech.title}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {t.methodology.tech.items.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: prefersReducedMotion ? 0 : i * 0.1, duration: prefersReducedMotion ? 0.01 : 0.5 }}
                                className="glass-panel p-4 rounded-lg"
                            >
                                <h4 className="font-bold text-neon-yellow mb-1">{item.name}</h4>
                                <p className="text-sm text-text-tertiary">{item.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Design Principles */}
            <section className="relative z-10 py-16 px-6 bg-bg-midnight/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center neon-text">{t.methodology.principles.title}</h2>
                    <ul className="space-y-4">
                        {t.methodology.principles.items.map((principle, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: prefersReducedMotion ? 0 : i * 0.1, duration: prefersReducedMotion ? 0.01 : 0.5 }}
                                className="flex items-start gap-3 text-text-secondary"
                            >
                                <span className="w-2 h-2 rounded-full bg-neon-cyan mt-2 flex-shrink-0"></span>
                                <span className="text-lg">{principle}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 py-20 px-6 text-center border-t border-white/10">
                <Link href="/" className="neon-button inline-block active:scale-95 transition-transform" aria-label={t.methodology.cta}>
                    {t.methodology.cta}
                </Link>
            </section>
        </main>
    );
}
