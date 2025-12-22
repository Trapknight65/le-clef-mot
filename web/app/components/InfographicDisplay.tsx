import React from 'react';
import { EtymologyData } from './TriptychDisplay';
import { Download, Scroll } from 'lucide-react';

interface InfographicDisplayProps {
    data: EtymologyData;
}

export default function InfographicDisplay({ data }: InfographicDisplayProps) {
    return (
        <div className="w-full h-full flex justify-center p-4 md:p-8 bg-stone-900 overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-[#fdfbf7] text-stone-900 shadow-2xl overflow-hidden font-serif aspect-[1/1.4] flex flex-col p-8 md:p-12">
                {/* Vintage Paper Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply"></div>
                <div className="absolute inset-0 pointer-events-none border-[16px] border-double border-stone-300 opacity-50"></div>

                {/* Header */}
                <header className="relative z-10 flex flex-col items-center mb-8 border-b-2 border-stone-900 pb-6">
                    <div className="text-xs font-bold tracking-[0.3em] uppercase mb-2 text-stone-500">
                        L'Étymologie Illustrée
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-stone-900 capitalize">
                        {data.word}
                    </h1>
                </header>

                {/* Main Visual */}
                <div className="relative z-10 flex-grow grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Image */}
                    <div className="md:col-span-7 flex flex-col gap-4">
                        <div className="relative w-full aspect-[4/5] border-4 border-stone-900 p-2 bg-white shadow-lg rotate-1">
                            {data.image_url ? (
                                <img
                                    src={data.image_url}
                                    alt={data.visual_subject}
                                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                                />
                            ) : (
                                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 italic">
                                    Archive Missing
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 text-xs font-mono border border-stone-900">
                                FIG. 1: {data.visual_subject}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Text */}
                    <div className="md:col-span-5 flex flex-col justify-between">
                        <div>
                            <div className="mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest border-b border-stone-400 pb-1 mb-2">Root Origin</h3>
                                <p className="text-2xl font-bold italic text-amber-900 font-serif">
                                    "{data.root}"
                                </p>
                                <p className="text-sm text-stone-600 mt-1 italic">
                                    {data.root_concept}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest border-b border-stone-400 pb-1 mb-2">The Story</h3>
                                <p className="text-sm md:text-base leading-relaxed text-stone-800 text-justify first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-amber-900">
                                    {data.story}
                                </p>
                            </div>
                        </div>

                        {/* Footer / Meta in box */}
                        <div className="mt-8 border-2 border-stone-900 p-4 bg-amber-50/50">
                            <h4 className="font-bold text-xs uppercase mb-2">Semantic Evolution</h4>
                            <div className="flex items-center justify-between text-sm">
                                <span>{data.root}</span>
                                <span className="text-stone-400">→</span>
                                <span className="font-bold">{data.word}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-10 mt-8 pt-4 border-t border-stone-300 flex justify-between items-end text-stone-500">
                    <div className="flex flex-col">
                        <span className="font-bold text-xs tracking-widest uppercase text-stone-900">Le Mot Clef</span>
                        <span className="text-[10px] font-mono">Digital Archive No. {Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="text-[10px] uppercase font-mono tracking-widest">
                        {new Date().toLocaleDateString()}
                    </div>
                </footer>
            </div>
        </div>
    );
}
