'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonWordProps {
    prefersReducedMotion?: boolean;
}

export default function SkeletonWord({ prefersReducedMotion = false }: SkeletonWordProps) {
    const pulseAnimation = prefersReducedMotion ? {} : {
        animate: { opacity: [0.5, 0.8, 0.5] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-8 space-y-8" role="status" aria-label="Loading etymology data">
            <span className="sr-only">Loading etymology information, please wait...</span>

            {/* Title Skeleton */}
            <motion.div
                {...pulseAnimation}
                className="h-12 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg w-3/4 mx-auto"
            />

            {/* Metadata Row Skeleton */}
            <div className="flex justify-center gap-4">
                <motion.div
                    {...pulseAnimation}
                    className="h-6 bg-slate-700/30 rounded w-32"
                />
                <motion.div
                    {...pulseAnimation}
                    className="h-6 bg-slate-700/30 rounded w-40"
                />
                <motion.div
                    {...pulseAnimation}
                    className="h-6 bg-slate-700/30 rounded w-24"
                />
            </div>

            {/* Image Skeleton */}
            <motion.div
                {...pulseAnimation}
                className="aspect-video bg-gradient-to-br from-slate-700/20 to-slate-600/20 rounded-xl w-full max-w-2xl mx-auto"
            />

            {/* Timeline Skeleton */}
            <div className="space-y-6 max-w-3xl mx-auto">
                {[1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        {...pulseAnimation}
                        className="space-y-3"
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        <div className="h-8 bg-slate-700/40 rounded w-1/2" />
                        <div className="h-4 bg-slate-700/20 rounded w-full" />
                        <div className="h-4 bg-slate-700/20 rounded w-5/6" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
