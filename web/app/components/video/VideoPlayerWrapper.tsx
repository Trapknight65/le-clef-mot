"use client";

import React from 'react';
import { Player } from '@remotion/player';
import { MyVideo } from './VideoComposition';
import { VideoScript } from '@/lib/types';

interface VideoPlayerWrapperProps {
    script: VideoScript;
    images?: { cora: string; historical: string | null };
}

export default function VideoPlayerWrapper({ script, images }: VideoPlayerWrapperProps) {
    const totalDurationInFrames = script.video_meta.total_duration * 30; // 30fps

    return (
        <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <Player
                component={MyVideo}
                inputProps={{ script, images }}
                durationInFrames={totalDurationInFrames}
                fps={30}
                compositionWidth={1080}
                compositionHeight={1920}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                controls
                autoPlay
            />
        </div>
    );
}
