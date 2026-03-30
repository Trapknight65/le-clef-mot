import React from 'react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-20 w-full py-8 text-center text-sm text-text-tertiary backdrop-blur-sm border-t border-white/10 bg-bg-midnight/50" role="contentinfo">
            <div className="container mx-auto px-4">
                <nav className="mb-4 flex justify-center gap-8" aria-label="Footer navigation">
                    <Link
                        href="/about"
                        className="hover:text-neon-cyan active:opacity-70 transition-all hover:underline underline-offset-4"
                        aria-label="Learn about Le Clef Mot"
                    >
                        About
                    </Link>
                    <Link
                        href="/methodology"
                        className="hover:text-neon-cyan active:opacity-70 transition-all hover:underline underline-offset-4"
                        aria-label="Discover our methodology"
                    >
                        Methodology
                    </Link>
                    <Link
                        href="/privacy"
                        className="hover:text-neon-cyan active:opacity-70 transition-all hover:underline underline-offset-4"
                        aria-label="Read our privacy policy"
                    >
                        Privacy
                    </Link>
                </nav>
                <p className="font-medium text-text-secondary">
                    &copy; {currentYear} <span className="neon-text-cyan">Allan Deschamps</span> & <span className="neon-text-cyan">Redbrush Agency</span>.
                </p>
                <p className="mt-2 text-xs opacity-60">Crafted with AI · Visual RAG Engine</p>
            </div>
        </footer>
    );
}
