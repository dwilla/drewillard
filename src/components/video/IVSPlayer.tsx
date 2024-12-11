'use client';

import { useEffect, useRef } from 'react';
import { create } from 'amazon-ivs-player';

interface IVSPlayerProps {
  playbackUrl: string;
  isLive: boolean;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export default function IVSPlayer({ playbackUrl, isLive, onReady, onError }: IVSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    try {
      // Create player
      const player = create({
        wasmWorker: '/amazon-ivs-wasmworker.min.js',
        wasmBinary: '/amazon-ivs-wasmworker.min.wasm',
      });

      playerRef.current = player;
      player.attachHTMLVideoElement(videoRef.current);

      // Add event listeners
      player.addEventListener('ready', () => {
        onReady?.();
      });

      player.addEventListener('error', (error: Error) => {
        console.error('IVS Player error:', error);
        onError?.(error);
      });

      // Load and play stream
      player.load(playbackUrl);
      player.play();

      return () => {
        player.delete();
      };
    } catch (error) {
      console.error('Error initializing IVS player:', error);
      onError?.(error as Error);
    }
  }, [playbackUrl, onReady, onError]);

  return (
    <div className="relative w-full aspect-video bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        controls={!isLive}
      />
    </div>
  );
} 