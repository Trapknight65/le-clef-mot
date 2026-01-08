"use client";

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function ParticleBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const numParticles = 50;

        // Clear previous
        container.innerHTML = '';

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random styling
            const size = Math.random() * 4 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.position = 'absolute';
            particle.style.background = Math.random() > 0.5 ? '#06b6d4' : '#64748b'; // Cyan or Slate
            particle.style.borderRadius = '50%';
            particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            container.appendChild(particle);
        }

        const animation = anime({
            targets: container.querySelectorAll('.particle'),
            translateY: () => anime.random(-100, 100),
            translateX: () => anime.random(-100, 100),
            scale: () => anime.random(0.5, 1.5),
            opacity: () => anime.random(0.2, 0.8),
            easing: 'easeInOutQuad',
            duration: () => anime.random(3000, 8000),
            delay: () => anime.random(0, 1000),
            direction: 'alternate',
            loop: true
        });

        return () => {
            animation.pause();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30"
        />
    );
}
