import React from 'react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-20 w-full py-8 text-center text-sm text-slate-600 backdrop-blur-sm border-t border-white/5 bg-slate-900/50">
            <div className="container mx-auto px-4">
                <div className="mb-4 flex justify-center gap-6">
                    <Link href="/about" className="hover:text-etymo-accent transition-colors">About</Link>
                    <Link href="/methodology" className="hover:text-etymo-accent transition-colors">Methodology</Link>
                    <Link href="/privacy" className="hover:text-etymo-accent transition-colors">Privacy</Link>
                </div>
                <p className="font-medium">
                    &copy; {currentYear} <span className="text-slate-400">Allan Deschamps</span> & <span className="text-slate-400">Redbrush Agency</span>.
                </p>
                <p className="mt-1 text-xs opacity-50">Crafted with AI • Visual RAG Engine</p>
            </div>
        </footer>
    );
}
