import { useEffect, useState } from "react";
import { PlayerUiState, types } from "@video/video-client-web";
import { useVideoClient } from "./VideoClient";
import { useManifestUrl } from "./ManifestUrl";

export const usePlayer = () => {
  const [playerUi, setPlayerUi] = useState<PlayerUiState | null>(null);
  const { streamId, videoClient } = useVideoClient('viewer');
  const manifestUrl = useManifestUrl(streamId);

  useEffect(() => {
    if (videoClient != null && !playerUi && manifestUrl !== '') {
      const player: types.PlayerAPI = videoClient.requestPlayer(manifestUrl, {});
      setPlayerUi(new PlayerUiState(player));
    }

    // Cleanup on unmount or change
    return () => {
      if (playerUi) {
        playerUi.dispose("Cleaning up playerUi on unmount or change");
        setPlayerUi(null);
      }
    };
  }, [videoClient, playerUi, manifestUrl]);

  return playerUi;
};