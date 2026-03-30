import React from 'react';

export default function CoraAvatar({ className = "w-12 h-12", size = 48 }: { className?: string; size?: number }) {
    return (
        <div className={`relative flex items-center justify-center rounded-full bg-bg-midnight border border-accent-cyan/30 shadow-[0_0_15px_rgba(0,229,255,0.3)] ${className}`} aria-label="Cora AI Avatar">
            {/* Anime-style 'Ghost' core */}
            <div className="absolute inset-2 rounded-full border border-accent-cyan opacity-80" />
            <div className="absolute inset-3 rounded-full border border-neon-yellow opacity-60 animate-pulse-slow" />

            {/* Central 'Eye' / Core */}
            <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 text-accent-cyan">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4V6M12 18V20M6 12H4M20 12H18M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="currentColor" fillOpacity="0.8" />
                <circle cx="12" cy="12" r="2" fill="#FFEB3B" className="animate-pulse" />
            </svg>

            {/* Orbital Rings */}
            <div className="absolute inset-0 rounded-full border-t border-accent-magenta/50 animate-spin-slow" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 rounded-full border-b border-neon-yellow/50 animate-spin-reverse-slow" style={{ animationDuration: '4s' }} />
        </div>
    );
}
