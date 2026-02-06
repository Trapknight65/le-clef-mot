import React from 'react';
import { Sparkles, History, Box, Zap } from 'lucide-react';
import ParticleBackground from '../components/effects/ParticleBackground';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-etymo-bg text-slate-100 font-sans selection:bg-etymo-primary selection:text-white relative overflow-hidden">
            <ParticleBackground />

            {/* Simple Header */}
            <div className="relative z-20 p-6 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto">
                    <a href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-etymo-primary to-etymo-accent rounded-lg flex items-center justify-center">
                            <span className="font-serif">M</span>
                        </div>
                    </a>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20 max-w-4xl">

                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-etymo-accent mb-6">
                        <History size={12} />
                        <span>The Chronicle</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent mb-6">
                        The Soul of the Machine
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        A cinematic exploration of how we taught a machine to see the history of words.
                    </p>
                </div>

                <div className="space-y-24">
                    {/* Section 1 */}
                    <section className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent hidden md:block"></div>
                        <div className="absolute -left-[54px] top-0 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] hidden md:block"></div>

                        <h2 className="text-3xl font-bold text-white mb-6">In the Beginning, There Was Noise</h2>
                        <div className="prose prose-invert prose-lg text-slate-300">
                            <p>
                                The journey of <strong>Le Mot Clef</strong> began with a simple question: <em>Can AI do more than just answer? Can it feel?</em>
                            </p>
                            <p>
                                Initially, we struggled with friction. The early prototypes (The Bytez Era) were rigid. The models refused to cooperate, hitting walls of "upgrade required" and API limits. It was a machine fighting its operator.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent hidden md:block"></div>
                        <div className="absolute -left-[54px] top-0 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)] hidden md:block"></div>

                        <h2 className="text-3xl font-bold text-white mb-6">The Modulation (The Pivot)</h2>
                        <div className="prose prose-invert prose-lg text-slate-300">
                            <p>
                                On Jan 8, 2026, we stopped fighting. We modulated. We deconstructed the monolith into specialized instruments.
                            </p>
                            <ul className="list-none space-y-4 my-6 pl-0">
                                <li className="flex gap-4 items-start">
                                    <div className="p-2 rounded bg-slate-800 text-cyan-400"><Box size={18} /></div>
                                    <div>
                                        <strong className="text-white">Groq (Llama 3.3)</strong> became our poet. Fast, loose, and lyrical. It handles the narrative.
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="p-2 rounded bg-slate-800 text-purple-400"><Zap size={18} /></div>
                                    <div>
                                        <strong className="text-white">Fal.ai (Flux Dev)</strong> became our painter. Precise, geometric, and visually stunning.
                                    </div>
                                </li>
                            </ul>
                            <p>
                                This separation of concerns allowed the system to sing.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="relative">
                        <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block"></div>
                        <div className="absolute -left-[54px] top-0 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] hidden md:block"></div>

                        <h2 className="text-3xl font-bold text-white mb-6">The Symphony</h2>
                        <div className="prose prose-invert prose-lg text-slate-300">
                            <p>
                                Today, <strong>Le Mot Clef</strong> is a Visual RAG (Retrieval-Augmented Generation) engine. It doesn't just look up definitions; it retrieves the <em>soul</em> of the word and visualizes it in real-time.
                            </p>
                            <p>
                                From the "diamond geometry" of our video players to the "ghost buttons" of our UI, every pixel is designed to be cinematic. This is not a dictionary. It is a theater.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
