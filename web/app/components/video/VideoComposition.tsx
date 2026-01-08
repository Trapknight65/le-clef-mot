"use client";

import React from 'react';
import { Sequence, Audio, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { VideoScript } from '@/lib/types';

interface MyVideoProps {
    script: VideoScript;
    images?: { cora: string; historical: string | null };
}

// Simple Title Component
const TitleOverlay = ({ text }: { text: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        frame,
        fps,
        config: { damping: 200 }
    });

    return (
        <div style={{
            position: 'absolute',
            top: '40%',
            left: 0,
            width: '100%',
            textAlign: 'center',
            transform: `scale(${scale})`,
        }}>
            <h1 style={{
                fontSize: '80px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 900,
                color: 'white',
                textShadow: '0 0 20px rgba(0,0,0,0.8)',
                padding: '20px',
                background: 'rgba(0,0,0,0.5)',
                textTransform: 'uppercase'
            }}>
                {text}
            </h1>
        </div>
    );
};

export const MyVideo = ({ script, images }: MyVideoProps) => {
    const { timeline } = script;

    // Default Frame Rate assumes 30fps
    const FPS = 30;

    return (
        <div style={{ flex: 1, backgroundColor: 'black' }}>
            {/* Background Music (Placeholder) */}
            {/* <Audio src="https://example.com/music.mp3" loop /> */}

            {timeline.map((scene, index) => {
                const startFrame = index * (scene.duration * FPS);
                const durationInFrames = scene.duration * FPS;

                // Determine Visual Source
                let visualSrc = "https://placehold.co/1080x1920/1e293b/white?text=Le+Mot+Clef"; // Default brand placeholder

                // 1. Try Flux Image (High Priority)
                if (scene.visual_source === "Flux-Generated" && images?.cora && images.cora.startsWith('http')) {
                    visualSrc = images.cora;
                }
                // 2. Try Historical Image
                else if (scene.visual_source === "Stock-Video" && images?.historical && images.historical.startsWith('http')) {
                    visualSrc = images.historical;
                }
                // 3. Last Resort Fallback to whatever image we have
                else if (images?.cora && images.cora.startsWith('http')) {
                    visualSrc = images.cora;
                }
                else if (images?.historical && images.historical.startsWith('http')) {
                    visualSrc = images.historical;
                }

                return (
                    <Sequence
                        from={startFrame}
                        durationInFrames={durationInFrames}
                        key={scene.scene_id}
                        layout="none"
                    >
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>

                            {/* Visual Layer */}
                            {scene.visual_source !== 'Text-Only' && (
                                <Img
                                    src={visualSrc}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            )}

                            {/* Text Overlay */}
                            <TitleOverlay text={scene.overlay_text} />

                            {/* Voiceover (Placeholder TTS or generated URL) */}
                            {/* <Audio src={getElevenLabsUrl(scene.voiceover_script)} /> */}
                        </div>
                    </Sequence>
                );
            })}
        </div>
    );
};
