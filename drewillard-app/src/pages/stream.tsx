import { useState } from 'react';
import IVSPlayer from '@/components/video/IVSPlayer';

export default function StreamPage() {
  const [isLive, setIsLive] = useState(true);
  
  // These URLs will come from your Amazon IVS setup
  const liveStreamUrl = process.env.NEXT_PUBLIC_IVS_PLAYBACK_URL || '';
  const recordingUrl = ''; // This will be the URL of your recorded stream from S3

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isLive ? 'Live Stream' : 'Previous Recording'}
      </h1>
      
      <div className="mb-6">
        <IVSPlayer 
          playbackUrl={isLive ? liveStreamUrl : recordingUrl}
          isLive={isLive}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsLive(true)}
          className={`px-4 py-2 rounded ${
            isLive 
              ? 'bg-foreground text-background' 
              : 'border border-foreground'
          }`}
        >
          Live Stream
        </button>
        <button
          onClick={() => setIsLive(false)}
          className={`px-4 py-2 rounded ${
            !isLive 
              ? 'bg-foreground text-background' 
              : 'border border-foreground'
          }`}
        >
          Previous Recording
        </button>
      </div>
    </div>
  );
} 