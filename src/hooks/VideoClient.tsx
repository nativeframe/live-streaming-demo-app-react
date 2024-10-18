import React, { useState, useEffect } from 'react';
import { types } from '@video/video-client-web';
import { initVideoClient } from '../utils/videoclient';
import { createStream, getActiveStreamId } from "../utils/streams";
import { fetchBroadcasterToken, fetchViewerToken } from "../utils/userAuth";

type ClientType = 'broadcaster' | 'viewer';

export const useVideoClient = (type: ClientType) => {
  const [streamId, setStreamId] = useState<string | undefined>(undefined);
  const [videoClient, setVideoClient] = useState<types.VideoClientAPI | null>(null);

  useEffect(() => {
    const initializeVideoClient = async () => {
      try {
        let newStreamId: string;
        let token: string;

        // If type is broadcaster, we create a new stream and fetch a token for the broadcaster
        // If type is viewer, we fetch the active stream id and a token for the viewer
        if (type === 'broadcaster') {
          newStreamId = await createStream();
          token = await fetchBroadcasterToken(newStreamId);
        } else {
          newStreamId = await getActiveStreamId() || '';
          token = await fetchViewerToken();
        }

        const newVideoClient = await initVideoClient(token);
        setStreamId(newStreamId);
        setVideoClient(newVideoClient);
      } catch (error) {
        console.error(`Failed to initialize ${type} video client:`, error);
        setStreamId(undefined);
        setVideoClient(null);
      }
    };

    initializeVideoClient();

    // Cleanup on unmount or change
    return () => {
      videoClient?.dispose("Cleaning up video client on unmount or change");
      setStreamId(undefined);
      setVideoClient(null);
    };
  }, [type]);

  return { streamId, videoClient };
};
