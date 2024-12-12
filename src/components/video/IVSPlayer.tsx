'use client';

import { useEffect, useRef } from 'react';
import { create, PlayerEventType, PlayerState, PlayerError, MediaPlayer } from 'amazon-ivs-player';

interface IVSPlayerProps {
  playbackUrl: string;
  isLive: boolean;
  onReady?: () => void;
  onError?: (error: PlayerError) => void;
}

export default function IVSPlayer({ playbackUrl, isLive, onReady, onError }: IVSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<MediaPlayer | null>(null);

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
      player.addEventListener(PlayerState.READY, () => {
        onReady?.();
      });

      player.addEventListener(PlayerEventType.ERROR, (error: PlayerError) => {
        console.error('IVS Player error:', error);
        onError?.(error);
      });

      // Load and play stream
      player.load(playbackUrl);
      player.play();

      return () => {
        if (playerRef.current) {
          playerRef.current.delete();
          playerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing IVS player:', error);
      onError?.(error as PlayerError);
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