'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
    variant?: 'home' | 'inner' | 'sticky';
    backLink?: {
        href: string;
        type: 'search' | 'default';
    };
}

export default function Header({ variant = 'home', backLink }: HeaderProps) {
    const { t } = useLanguage();

    const isHome = variant === 'home';
    const isSticky = variant === 'sticky';

    return (
        <header className={`
            w-full p-6 flex items-center justify-between z-50
            ${isSticky ? 'sticky top-0 bg-bg-midnight/80 backdrop-blur-md border-b border-white/10' : 'relative'}
            ${!isHome && !isSticky ? 'bg-bg-midnight/30 border-b border-white/10' : ''}
        `}>
            {/* Left Section: Logo or Back Link */}
            <div className="flex items-center gap-4">
                {backLink ? (
                    <Link href={backLink.href} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm uppercase tracking-wider">
                            {backLink.type === 'search' ? t.nav.backToSearch : t.nav.back}
                        </span>
                    </Link>
                ) : (
                    <Link href="/" className="flex items-center gap-4 group hover:opacity-90 transition-opacity" aria-label="Return to homepage">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 animate-neon-flicker">
                            <Image
                                src="/brand/le_clef_mot_logo_neon_1770421909869.png"
                                alt="Le Clef Mot logo"
                                width={48}
                                height={48}
                                className="object-contain drop-shadow-[0_0_15px_rgba(255,235,59,0.6)]"
                            />
                        </div>
                        {(isHome || isSticky) && (
                            <span className={`neon-text font-bold tracking-wide ${isSticky ? 'text-lg' : 'text-xl'} hidden sm:inline`}>
                                Le Clef Mot
                            </span>
                        )}
                    </Link>
                )}
            </div>

            {/* Right Section: Navigation & Toggle */}
            <div className="flex items-center gap-4 md:gap-8">
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent-cyan hover:shadow-[0_0_10px_rgba(0,229,255,0.4)] transition-all">
                        {t.nav.about}
                    </Link>
                    <Link href="/methodology" className="text-sm font-bold uppercase tracking-widest text-text-secondary hover:text-accent-cyan hover:shadow-[0_0_10px_rgba(0,229,255,0.4)] transition-all">
                        {t.nav.methodology}
                    </Link>
                </nav>

                {/* Mobile Nav */}
                <div className="md:hidden flex gap-4">
                    <Link href="/about" className="text-xs font-bold uppercase text-text-secondary hover:text-white">
                        {t.nav.about}
                    </Link>
                    <Link href="/methodology" className="text-xs font-bold uppercase text-text-secondary hover:text-white">
                        {t.nav.methodology}
                    </Link>
                </div>

                <div className="w-px h-6 bg-white/10 hidden md:block" />

                <LanguageToggle />
            </div>
        </header>
    );
}
