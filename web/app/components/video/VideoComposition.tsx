"use client";

import React from 'react';
import { Sequence, Audio, Img, useCurrentFrame, interpolate, useVideoConfig, spring } from 'remotion';
import { VideoScript } from '@/lib/types';

interface MyVideoProps {
    script: VideoScript;
    images?: { cora: string; historical: string | null };
}

// Neon thematic variations based on connotation/background
const NEON_THEMES = [
    { hex: '#00ffab', rgb: '0, 255, 171' },   // Emerald
    { hex: '#00f3ff', rgb: '0, 243, 255' },   // Cyan
    { hex: '#ff003c', rgb: '255, 0, 60' },    // Crimson/Magenta
    { hex: '#ffb703', rgb: '255, 183, 3' }    // Amber/Gold
];

export const MyVideo = ({ script, images }: MyVideoProps) => {
    const { timeline } = script;
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig(); 

    const heightPerScene = 1920; 
    
    // Continuous vertical scroll based on the number of scenes
    const maxScroll = -(timeline.length - 1) * heightPerScene;
    
    const scrollY = interpolate(
        frame,
        [0, durationInFrames - 1], 
        [0, maxScroll],
        { extrapolateRight: 'clamp' }
    );

    // Calculate absolute start times for Sequences 
    const sceneTimings = timeline.reduce<{start: number, duration: number}[]>((acc, scene) => {
        const start = acc.length > 0 ? acc[acc.length - 1].start + acc[acc.length - 1].duration : 0;
        acc.push({ start, duration: scene.duration * fps });
        return acc;
    }, []);

    // Spring animation for the Marginalia sidebar entrance
    const sidebarEntrance = spring({
        frame,
        fps,
        config: { damping: 16, mass: 1 }
    });
    const sidebarX = interpolate(sidebarEntrance, [0, 1], [-140, 0]);

    // Slow animated tracking of the Marginalia text
    const textTracking = interpolate(
        frame,
        [0, durationInFrames],
        [0, 500] // Slides along the axis
    );

    return (
        <div style={{ 
            flex: 1, 
            backgroundColor: '#020617', // Deep slate/black for neon aesthetic
            fontFamily: 'Inter, sans-serif',
            color: '#FFFFFF', 
            display: 'flex',
            flexDirection: 'row',
            width: '1080px',
            height: '1920px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            
            {/* FIXED MARGINALIA SIDEBAR */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '140px',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                backdropFilter: 'blur(10px)',
                transform: `translateX(${sidebarX}px)`
            }}>
                <div style={{
                    transform: `rotate(-90deg) translateX(${textTracking}px)`,
                    transformOrigin: 'center center',
                    width: '3000px', // Extra wide to allow scrolling
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        whiteSpace: 'nowrap',
                        fontSize: '36px',
                        fontWeight: 300,
                        textTransform: 'uppercase',
                        letterSpacing: '12px',
                        margin: 0,
                        color: 'rgba(255,255,255,0.7)',
                        textShadow: '0 0 10px rgba(255,255,255,0.2)'
                    }}>
                        DU SACRÉ AU PROFANE
                    </h2>
                </div>
            </div>

            {/* SCROLLING MAIN CONTAINER */}
            <div style={{
                position: 'absolute',
                left: '140px',
                right: 0,
                top: 0,
                transform: `translateY(${scrollY}px)`,
                display: 'flex',
                flexDirection: 'column',
                width: '940px'
            }}>
                {timeline.map((scene, index) => {
                    const theme = NEON_THEMES[index % NEON_THEMES.length];
                    
                    const targetFrame = (durationInFrames - 1) * (index / Math.max(1, timeline.length - 1));
                    const frameRange = Math.max(1, (durationInFrames - 1) / (timeline.length - 1));
                    
                    // Trigger effect as soon as scene enters the bottom half of the screen
                    const enterFrameStart = Math.max(0, targetFrame - frameRange * 0.4);
                    const sceneRelativeFrame = Math.max(0, frame - enterFrameStart);

                    // Organic entrance using Remotion Springs
                    const cardSpring = spring({
                        frame: sceneRelativeFrame,
                        fps,
                        config: { damping: 14, mass: 0.9, stiffness: 100 }
                    });

                    // Effects: organic scale up and fade in mapped from the spring value
                    const scale = interpolate(cardSpring, [0, 1], [0.85, 1], { extrapolateRight: 'clamp' });
                    const opacity = interpolate(cardSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

                    let visualSrc = null;
                    if (scene.visual_source === "Flux-Generated" && images?.cora && images.cora.startsWith('http')) {
                        visualSrc = images.cora;
                    } else if (scene.visual_source === "Stock-Video" && images?.historical && images.historical.startsWith('http')) {
                        visualSrc = images.historical;
                    } else if (images?.cora && images.cora.startsWith('http')) {
                        visualSrc = images.cora;
                    } else if (images?.historical && images.historical.startsWith('http')) {
                        visualSrc = images.historical;
                    }

                    return (
                        <div 
                            key={scene.scene_id || index} 
                            style={{ 
                                height: `${heightPerScene}px`,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '60px',
                                boxSizing: 'border-box',
                                position: 'relative'
                            }}
                        >
                            <Sequence 
                                from={sceneTimings[index].start} 
                                durationInFrames={sceneTimings[index].duration}
                                layout="none"
                            >
                                {/* Audio placeholder */}
                            </Sequence>

                            {/* ELEGANT THIN-BORDERED CARD */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transform: `scale(${scale})`,
                                opacity: opacity,
                                width: '100%',
                                height: '80%',
                                border: `2px solid rgba(${theme.rgb}, 0.5)`,
                                borderRadius: '32px',
                                padding: '60px 40px',
                                background: `radial-gradient(circle at top, rgba(${theme.rgb}, 0.05) 0%, transparent 60%), rgba(2, 6, 23, 0.4)`,
                                boxShadow: `0 0 60px rgba(${theme.rgb}, 0.1)`,
                                backdropFilter: 'blur(20px)'
                            }}>
                                {/* ERA/TITLE OVERLAY */}
                                {scene.overlay_text && (
                                    <h1 style={{
                                        fontSize: '72px',
                                        fontWeight: 900,
                                        marginBottom: '60px',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        textTransform: 'uppercase',
                                        textShadow: `0 0 30px rgba(${theme.rgb}, 0.6)`,
                                        color: '#FFFFFF'
                                    }}>
                                        {scene.overlay_text}
                                    </h1>
                                )}

                                {/* VISUAL FRAME */}
                                {visualSrc && (
                                    <div style={{
                                        border: `2px solid rgba(${theme.rgb}, 0.8)`, // Elegant thin inner border
                                        padding: '0',
                                        width: '100%',
                                        maxWidth: '700px',
                                        aspectRatio: '1',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                        borderRadius: '16px',
                                        boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(${theme.rgb}, 0.2)`
                                    }}>
                                        <Img 
                                            src={visualSrc} 
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                )}
                                
                                {/* ALIGNMENT/ACCENT ELEMENT */}
                                <div style={{
                                    marginTop: 'auto',
                                    marginBottom: '20px',
                                    width: '140px',
                                    height: '4px',
                                    background: `linear-gradient(90deg, transparent, ${theme.hex}, transparent)`, 
                                    borderRadius: '2px',
                                    boxShadow: `0 0 20px rgba(${theme.rgb}, 0.8)`,
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
