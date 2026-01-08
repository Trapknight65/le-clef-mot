"use client";

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface TextScrambleProps {
    text: string;
    className?: string;
}

export default function TextScramble({ text, className }: TextScrambleProps) {
    const elRef = useRef<HTMLParagraphElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!elRef.current || hasAnimated.current) return;

        const originalText = text;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

        const dummy = { value: 0 };

        anime({
            targets: dummy,
            value: 1,
            duration: 1500,
            easing: 'easeOutQuad',
            update: () => {
                if (!elRef.current) return;

                const progress = dummy.value;
                const len = originalText.length;
                const numRevealed = Math.floor(progress * len);

                let output = '';
                for (let i = 0; i < len; i++) {
                    if (i < numRevealed) {
                        output += originalText[i];
                    } else {
                        output += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                elRef.current.innerText = output;
                // Preserve styling wrapper if needed, but innerText wipes children. 
                // For a simple text block this is fine.
            },
            complete: () => {
                if (elRef.current) elRef.current.innerText = originalText;
                hasAnimated.current = true;
            }
        });

    }, [text]);

    return (
        <p ref={elRef} className={className}>
            {text}
        </p>
    );
}
