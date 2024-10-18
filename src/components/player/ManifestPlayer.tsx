// Component: ManifestPlayer
// About: This components main purpose is to create our manifestPlayer, it utilizes the player, StreamsGrid and the VideoClient hook in order to achieve this. 

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  PlayerUiState,
  PlayerUiContext,
  types,
} from "@video/video-client-web";
import { Player } from "./Player";
import { fetchViewerToken } from "../../utils/userAuth";
import { initVideoClient } from "../../utils/videoclient";
import { getManifestUrl, getActiveStreamId } from "../../utils/streams";

export const ManifestPlayer = () => {
  // Stores the set manifestUrl.
  const [offline, setOffline] = useState<boolean>(false);
  const [manifestUrl, setManifestUrl] = useState<string>('');
  // Stores the playerUi State.
  const [playerUi, setPlayerUi] = useState<PlayerUiState | null>(null);
  const [videoClient, setVideoClient] = useState<types.VideoClientAPI | null>(null);
  const fetchAll = useCallback(async () => {
    const streamId = await getActiveStreamId();
    if (!streamId) {
      setOffline(true);
      return
    }

    const manifestUrl = await getManifestUrl(streamId);
    const token = await fetchViewerToken();
    const vc = await initVideoClient(token)
    if (manifestUrl) {
      setManifestUrl(manifestUrl);
      setVideoClient(vc); 
    } else {
      setOffline(true);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    // Check to make sure we have a videoClient, a manifestUrl and a token before we create our player
    if (videoClient != null && playerUi == null && manifestUrl != '') {
      // The second argument is the options, for this example we will use the defaults.
      const player: types.PlayerAPI = videoClient.requestPlayer(manifestUrl, {});
      setPlayerUi(new PlayerUiState(player));

      // If we dont have a token but we have a manifest url we need to generate a token first,
    }

    return () => {
      // Clear out our state on dismount or change
      setManifestUrl('');
      // Dispose of our player on dismount or change
      if (playerUi != null) {
        playerUi.dispose();
        setPlayerUi(null);
      }
    };
  }, [videoClient]);

  if (offline) {
    return <p>No running streams</p>
  }

  return (
    <>
      {
        playerUi ?
          <PlayerUiContext.Provider value={playerUi}>
            <Player />
          </PlayerUiContext.Provider> : <></>
      }
    </>



  );
};

export default ManifestPlayer;