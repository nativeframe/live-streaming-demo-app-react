import { useState, useEffect } from 'react';
import { types, AlwaysAuthClient, PlayerUiState } from '@video/video-client-web';
import { initVideoClient } from '../utils/videoclient';
import { getActiveStreamId } from '../utils/streams';

export const useVideoPlayer = (projectId: string) => {
  const [videoClient, setVideoClient] = useState<types.VideoClientAPI | null>(null);
  const [playerUi, setPlayerUi] = useState<PlayerUiState | null>(null);

  useEffect(() => {
    const initializeVideoClient = async () => {
      try {
        const authClient = new AlwaysAuthClient(projectId);
        const newVideoClient = await initVideoClient(projectId, authClient);
        setVideoClient(newVideoClient);
        const newStreamId = await getActiveStreamId() || '';
        try {
          const call = await newVideoClient.joinCall(newStreamId);
          console.log('call', call);
        } catch (error) {
          console.error('Failed to join call:', error);
        }
      } catch (error) {
        console.error('Failed to initialize video client:', error);
        setVideoClient(null);
      }
    };

    initializeVideoClient();

    return () => {
      if (videoClient) {
        videoClient.dispose("Cleaning up video client on unmount");
        setVideoClient(null);
        if (playerUi) {
          playerUi.dispose("Cleaning up playerUi on unmount");
          setPlayerUi(null);
        }
      }
    };
  }, [projectId]);

  useEffect(() => {
    if (!videoClient) return;

    const handlePlayerAdded = (event: { player: types.PlayerAPI }) => {
      const newPlayerUi = new PlayerUiState(event.player);
      setPlayerUi(newPlayerUi);
    };

    videoClient.on('playerAdded', handlePlayerAdded);

    return () => {
      videoClient.off('playerAdded', handlePlayerAdded);
      if (playerUi) {
        playerUi.dispose("Cleaning up playerUi on event cleanup");
        setPlayerUi(null);
      }
    };
  }, [videoClient]);

  return playerUi;
};
