import React from 'react';
import { Cpu, Database, Play, Layers } from 'lucide-react';
import ParticleBackground from '../components/effects/ParticleBackground';

export default function MethodologyPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 font-mono selection:bg-cyan-900 selection:text-white relative overflow-hidden">
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            {/* Simple Header */}
            <div className="relative z-20 p-6 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto">
                    <a href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                        <div className="w-8 h-8 border border-cyan-500/50 rounded flex items-center justify-center">
                            <span className="text-cyan-500">&lt;/&gt;</span>
                        </div>
                    </a>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20 max-w-5xl">

                <header className="mb-20 border-b border-slate-800 pb-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">System Architecture</h1>
                    <p className="text-cyan-400 text-lg">Protocol: Visual_RAG // v2.0.4</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="p-8 border border-slate-800 bg-slate-900/50 hover:border-cyan-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                            <Cpu size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Logic Core</h3>
                        <div className="text-sm font-bold text-slate-500 mb-4 font-sans">GROQ API • LLAMA 3.3</div>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            The narrative engine utilizes Llama 3.3-70b hosted on Groq LPU hardware. This provides near-instantaneous token generation, allowing the "Etymological Story" to be woven in real-time without latency.
                        </p>
                    </div>

                    <div className="p-8 border border-slate-800 bg-slate-900/50 hover:border-purple-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Visual Synthesis</h3>
                        <div className="text-sm font-bold text-slate-500 mb-4 font-sans">FAL.AI • FLUX DEV</div>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Visuals are synthesized on-demand using the Flux Dev model via Fal.ai. The prompts are strictly controlled to ensure "geometric" and "historical" accuracy, avoiding hallucinations common in smaller models.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Database size={100} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-8">The Data Flow</h3>

                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-emerald-400 w-24">INPUT &gt;&gt;</span>
                            <div className="bg-slate-950 px-4 py-2 rounded border border-slate-800 text-white">User queries "Amour"</div>
                        </div>
                        <div className="h-6 w-px bg-slate-700 ml-[6.5rem]"></div>
                        <div className="flex items-center gap-4">
                            <span className="text-cyan-400 w-24">PROCESS &gt;&gt;</span>
                            <div className="bg-slate-950 px-4 py-2 rounded border border-slate-800 text-white flex-1">
                                <span className="text-slate-500">// Parallel Execution</span><br />
                                1. Fetch Etymology Data (External Dictionary API, if avail)<br />
                                2. Generate Narrative (Groq)<br />
                                3. Generate Visual Prompt (Groq)<br />
                                4. Synthesize Image (Fal.ai)
                            </div>
                        </div>
                        <div className="h-6 w-px bg-slate-700 ml-[6.5rem]"></div>
                        <div className="flex items-center gap-4">
                            <span className="text-purple-400 w-24">RENDER &gt;&gt;</span>
                            <div className="bg-slate-950 px-4 py-2 rounded border border-slate-800 text-white">Cinematic Dashboard (Next.js)</div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
