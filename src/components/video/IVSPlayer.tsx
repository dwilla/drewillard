'use client';

import { useEffect, useRef } from 'react';

interface IVSPlayerProps {
  playbackUrl: string;
  isLive?: boolean;
  onReady?: () => void;
  onError?: (error: any) => void;
}

export default function IVSPlayerClient({ 
  playbackUrl, 
  isLive = true,
  onReady,
  onError 
}: IVSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initPlayer = async () => {
      try {
        if (!videoRef.current) {
          throw new Error('Video element not found');
        }
        if (!playbackUrl) {
          throw new Error('No playback URL provided');
        }

        console.log('Initializing IVS player with URL:', playbackUrl);
        
        // Load the WASM worker script
        const wasmWorkerScript = document.createElement('script');
        wasmWorkerScript.src = '/amazon-ivs-wasmworker.min.js';
        document.body.appendChild(wasmWorkerScript);

        await new Promise((resolve) => {
          wasmWorkerScript.onload = resolve;
        });

        const IVS = await import('amazon-ivs-player');
        
        if (!isMounted) return;

        console.log('IVS module loaded:', IVS);
        const { create, PlayerState, PlayerEventType } = IVS;

        if (!playerRef.current) {
          console.log('Creating new player instance');
          playerRef.current = create({
            wasmWorker: '/amazon-ivs-wasmworker.min.wasm',
            wasmBinary: '/amazon-ivs-wasmworker.min.wasm',
          });

          console.log('Player instance created:', playerRef.current);
          playerRef.current.attachHTMLVideoElement(videoRef.current);

          playerRef.current.addEventListener('stateChange', (state: any) => {
            console.log('Player State:', state);
            if (state === PlayerState.PLAYING) {
              console.log('Stream is playing');
              onReady?.();
            }
          });

          playerRef.current.addEventListener('error', (err: any) => {
            console.error('Player Error:', {
              message: err.message,
              type: err.type,
              code: err.code,
              source: err.source,
            });
            onError?.(err);
          });

          playerRef.current.addEventListener('qualityChanged', (quality: any) => {
            console.log('Quality Changed:', quality);
          });

          // Add more detailed event listeners
          playerRef.current.addEventListener('rebuffering', () => {
            console.log('Stream is rebuffering');
          });

          playerRef.current.addEventListener('buffering', () => {
            console.log('Stream is buffering');
          });

          playerRef.current.addEventListener('ended', () => {
            console.log('Stream has ended');
          });
        }

        console.log('Loading stream URL');
        await playerRef.current.load(playbackUrl);
        console.log('Playing stream');
        await playerRef.current.play();
      } catch (error) {
        console.error('Error initializing IVS player:', error);
        onError?.(error);
      }
    };

    console.log('Starting player initialization');
    initPlayer();

    return () => {
      console.log('Cleaning up player');
      isMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.pause();
          playerRef.current.delete();
          playerRef.current = null;
        } catch (error) {
          console.error('Error cleaning up player:', error);
        }
      }
      // Remove the WASM worker script
      const wasmScript = document.querySelector('script[src="/amazon-ivs-wasmworker.min.js"]');
      if (wasmScript) {
        wasmScript.remove();
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
        muted // Initially muted to allow autoplay
      />
    </div>
  );
} 