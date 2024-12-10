import { useEffect, useRef } from 'react';
import { create } from 'amazon-ivs-player';

interface IVSPlayerProps {
  playbackUrl: string;
  isLive?: boolean;
}

export default function IVSPlayerClient({ playbackUrl, isLive = true }: IVSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!playerRef.current) {
      const PlayerState = {
        ENDED: 'Ended',
        PLAYING: 'Playing',
        READY: 'Ready',
        BUFFERING: 'Buffering',
        IDLE: 'Idle',
      };

      playerRef.current = create({
        streaming: isLive,
        wasmWorker: isLive ? 'ivs-wasmworker.min.wasm' : undefined,
      });

      playerRef.current.attachHTMLVideoElement(videoRef.current);

      playerRef.current.addEventListener('stateChange', (state: any) => {
        console.log('Player State:', state);
      });

      playerRef.current.addEventListener('error', (error: any) => {
        console.error('Player Error:', error);
      });
    }

    playerRef.current.load(playbackUrl);
    playerRef.current.play();

    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.delete();
        playerRef.current = null;
      }
    };
  }, [playbackUrl, isLive]);

  return (
    <div className="relative w-full aspect-video">
      <video 
        ref={videoRef}
        className="w-full h-full"
        playsInline
        controls
      />
    </div>
  );
} 