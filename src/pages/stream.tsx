import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import IVSPlayer with no SSR
const IVSPlayer = dynamic(() => import('@/components/video/IVSPlayer'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full aspect-video bg-black flex items-center justify-center">
      <div className="text-white">Loading player...</div>
    </div>
  ),
});

export default function StreamPage() {
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // These URLs will come from your Amazon IVS setup
  const liveStreamUrl = process.env.NEXT_PUBLIC_IVS_STREAM_URL || '';
  const recordingUrl = ''; // This will be the URL of your recorded stream from S3

  useEffect(() => {
    // Debug environment variables
    console.log('Stream URL:', liveStreamUrl);
    console.log('Environment variables:', process.env);
  }, [liveStreamUrl]);

  // Don't render player if no URL is available
  if (!liveStreamUrl && isLive) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Stream Not Available</h1>
        <p>The live stream URL has not been configured.</p>
        <p className="mt-4 text-sm text-gray-600">
          Debug info: Check your .env.local file and make sure NEXT_PUBLIC_IVS_STREAM_URL is set correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isLive ? 'Live Stream' : 'Previous Recording'}
      </h1>
      
      <div className="relative mb-6">
        <IVSPlayer 
          playbackUrl={isLive ? liveStreamUrl : recordingUrl}
          isLive={isLive}
          onReady={() => {
            console.log('Player ready');
            setIsLoading(false);
          }}
          onError={(error) => {
            console.error('Player error:', error);
            setIsLoading(false);
          }}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setIsLive(true);
            setIsLoading(true);
          }}
          className={`px-4 py-2 rounded ${
            isLive 
              ? 'bg-foreground text-background' 
              : 'border border-foreground'
          }`}
        >
          Live Stream
        </button>
        <button
          onClick={() => {
            setIsLive(false);
            setIsLoading(true);
          }}
          className={`px-4 py-2 rounded ${
            !isLive 
              ? 'bg-foreground text-background' 
              : 'border border-foreground'
          }`}
        >
          Previous Recording
        </button>
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
        <h2 className="font-bold mb-2">Debug Information:</h2>
        <p>Stream URL: {liveStreamUrl || 'Not configured'}</p>
        <p>Mode: {isLive ? 'Live' : 'Recording'}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
} 