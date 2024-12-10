'use client';

import { useEffect, useRef, useState } from 'react';

interface IVSPlayerProps {
  playbackUrl: string;
  isLive?: boolean;
  onReady?: () => void;
  onError?: (error: any) => void;
}

function LoadingOverlay() {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className="text-white">Loading stream...</div>
    </div>
  );
}

export default function IVSPlayerClient({ 
  playbackUrl, 
  isLive = true,
  onReady,
  onError 
}: IVSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [shouldShowLoading, setShouldShowLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const hideLoadingOverlay = () => {
      if (mountedRef.current) {
        console.log('Hiding loading overlay');
        setShouldShowLoading(false);
      }
    };

    const initPlayer = async () => {
      try {
        if (!videoRef.current || !playbackUrl) return;

        const IVS = await import('amazon-ivs-player');
        if (!mountedRef.current) return;

        const { create, PlayerState } = IVS;

        playerRef.current = create({
          wasmWorker: '/amazon-ivs-wasmworker.min.js',
          wasmBinary: '/amazon-ivs-wasmworker.min.wasm'
        });

        await playerRef.current.attachHTMLVideoElement(videoRef.current);

        // Handle video element events
        videoRef.current.addEventListener('canplay', hideLoadingOverlay);
        videoRef.current.addEventListener('playing', hideLoadingOverlay);

        // Handle IVS player state changes
        playerRef.current.addEventListener('stateChange', (state: string) => {
          if (!mountedRef.current) return;
          console.log('Player state changed:', state);
          
          if (state === PlayerState.PLAYING) {
            console.log('Player is now playing');
            hideLoadingOverlay();
            onReady?.();
          }
        });

        playerRef.current.addEventListener('error', (err: any) => {
          if (!mountedRef.current) return;
          hideLoadingOverlay();
          onError?.(err);
        });

        // Load and play the stream
        await playerRef.current.load(playbackUrl);
        console.log('Stream loaded, attempting to play');
        await playerRef.current.play();

      } catch (error) {
        if (mountedRef.current) {
          setShouldShowLoading(false);
          onError?.(error);
        }
      }
    };

    initPlayer();

    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplay', hideLoadingOverlay);
        videoRef.current.removeEventListener('playing', hideLoadingOverlay);
      }
      
      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.delete();
          playerRef.current = null;
        } catch (error) {
          console.error('Error cleaning up player:', error);
        }
      }
    };
  }, [playbackUrl, isLive, onReady, onError]);

  return (
    <div className="relative w-full aspect-video bg-black">
      <video 
        ref={videoRef}
        className="w-full h-full"
        playsInline
        controls
        autoPlay
        muted={isLive}
      />
      {shouldShowLoading && <LoadingOverlay />}
    </div>
  );
} 