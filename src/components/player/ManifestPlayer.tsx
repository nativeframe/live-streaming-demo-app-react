// Component: ManifestPlayer
// About: This components main purpose is to create our manifestPlayer, it utilizes the player, StreamsGrid and the VideoClient hook in order to achieve this. 

import React, { useEffect, useState } from "react";
import {
  PlayerUiState,
  PlayerUiContext,
  types,
  VideoClient,
} from "@video/video-client-web";
import { Player } from "./Player";
import { useVideoClient } from "../../hooks/useVideoClient";
import { fetchToken, getKID } from "../../utils/auth";
import { getRandomName } from "../../utils/names";
import { backendEndpoint, projectId, serviceJwt } from "../../globalConfigs";
import { getActiveStreamId } from "../../utils/streams";

export const ManifestPlayer = () => {
  // Stores the set manifestUrl.
  const [manifestUrl, setManifestUrl] = useState<string>('');
  // Stores the playerUi State.
  const [playerUi, setPlayerUi] = useState<PlayerUiState | null>(null);
  const [videoClient, setVideoClient] = useState<VideoClient | null>(null);

  // Async function used to fetch our access token.
  const handleSetVideoClient = async () => {
    const user = getRandomName();
    const streamId = await getActiveStreamId();
    // Retrieves the manifest URL from the backend
    async function getManifestUrl(streamId: string) {
      try {
        const response = await fetch(`${backendEndpoint}/program/api/v1/projects/${projectId}/streams/${streamId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceJwt}`
          },
        });
        const data = await response.json();
        if (data && data.manifestUrl) {
          return data.manifestUrl;
        } else {
          console.error('No manifestUrl found');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    const manifest = await getManifestUrl(streamId);
    
    const kid = await getKID();
    const tokenOptions = {
      kid,
      videoToken: {
        scopes: ['view'],
        userId: user,
        ttl: 3600,
        data: {
          displayName: streamId,
        }
      }
    }
    // Create our token using our handleSetVideoClient helper function.
    const token = await fetchToken(tokenOptions);
    const vc = await useVideoClient(token);
    // Hook that sets up the videoClient, also used in the Encoder.
    setVideoClient(vc);
    setManifestUrl(manifest);
  };

  useEffect(() => {
    // Check to make sure we have a videoClient, a manifestUrl and a token before we create our player
    if (videoClient != null && playerUi == null && manifestUrl != '') {
      
      // The second argument is the options, for this example we will use the defaults.
      const player: types.PlayerAPI = videoClient.requestPlayer(manifestUrl, {});
      setPlayerUi(new PlayerUiState(player));

      // If we dont have a token but we have a manifest url we need to generate a token first,
    } else if (videoClient == null) {
      handleSetVideoClient();
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
  }, [videoClient, playerUi, manifestUrl]);


  return (
    <>
      {
        playerUi ?
          <PlayerUiContext.Provider value={playerUi}>
            <Player />
          </PlayerUiContext.Provider>
          :
          <h3>Please fetch your streams by clicking the button below and select one from the list below.</h3>
      }
    </>

    

  );
};

export default ManifestPlayer;