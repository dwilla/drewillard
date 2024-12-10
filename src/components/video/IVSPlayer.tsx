'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initPlayer = async () => {
      try {
        if (!videoRef.current) {
          console.error('Video element not found');
          throw new Error('Video element not found');
        }
        if (!playbackUrl) {
          console.error('No playback URL provided');
          throw new Error('No playback URL provided');
        }

        console.log('Starting player initialization with:', {
          playbackUrl,
          isLive,
          videoElement: !!videoRef.current
        });

        // Import IVS Player
        const IVS = await import('amazon-ivs-player');
        if (!isMounted) return;

        console.log('IVS module loaded successfully');
        const { create, PlayerState, PlayerEventType } = IVS;

        if (!playerRef.current) {
          const wasmBinaryPath = '/amazon-ivs-wasmworker.min.wasm';
          const wasmWorkerPath = '/amazon-ivs-wasmworker.min.js';

          console.log('Creating new player instance with config:', {
            wasmWorker: wasmWorkerPath,
            wasmBinary: wasmBinaryPath
          });
          
          playerRef.current = create({
            wasmWorker: wasmWorkerPath,
            wasmBinary: wasmBinaryPath
          });

          console.log('Player instance created successfully');
          
          try {
            await playerRef.current.attachHTMLVideoElement(videoRef.current);
            console.log('Video element attached successfully');
          } catch (error) {
            console.error('Error attaching video element:', error);
            throw error;
          }

          // Add event listeners
          playerRef.current.addEventListener(PlayerState.READY, () => {
            console.log('Player READY event fired');
            if (isMounted) {
              setIsLoading(false);
            }
          });

          playerRef.current.addEventListener('stateChange', (state: any) => {
            console.log('Player State Changed:', state);
            if (state === PlayerState.PLAYING) {
              console.log('Stream is playing');
              if (isMounted) {
                setIsLoading(false);
                onReady?.();
              }
            } else if (state === PlayerState.ENDED) {
              console.log('Stream ended');
              if (isMounted) {
                setIsLoading(true);
              }
            } else if (state === PlayerState.READY) {
              console.log('Player is ready');
              if (isMounted) {
                setIsLoading(false);
              }
            }
          });

          playerRef.current.addEventListener('error', (err: any) => {
            console.error('Player Error:', {
              message: err.message,
              type: err.type,
              code: err.code,
              source: err.source,
              stack: err.stack
            });
            if (isMounted) {
              setIsLoading(false);
              onError?.(err);
            }
          });

          // Add quality change listener
          playerRef.current.addEventListener('qualityChanged', (quality: any) => {
            console.log('Quality changed:', quality);
          });

          // Add network health listeners
          playerRef.current.addEventListener('rebuffering', () => {
            console.log('Network: Stream is rebuffering');
            if (isMounted) {
              setIsLoading(true);
            }
          });

          playerRef.current.addEventListener('buffering', () => {
            console.log('Network: Stream is buffering');
            if (isMounted) {
              setIsLoading(true);
            }
          });
        }

        console.log('Loading stream URL:', playbackUrl);
        await playerRef.current.load(playbackUrl);
        console.log('Stream URL loaded, attempting to play');
        
        try {
          await playerRef.current.play();
          console.log('Play command issued successfully');
        } catch (error) {
          console.error('Error playing stream:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error in player initialization:', error);
        if (isMounted) {
          setIsLoading(false);
          onError?.(error);
        }
      }
    };

    setIsLoading(true);
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
    };
  }, [playbackUrl, isLive, onReady, onError]);

  return (
    <div className="relative w-full aspect-video bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white">Loading stream...</div>
        </div>
      )}
      <video 
        ref={videoRef}
        className="w-full h-full"
        playsInline
        controls
        autoPlay
        muted={isLive} // Mute only live streams for autoplay
        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
      />
    </div>
  );
} 