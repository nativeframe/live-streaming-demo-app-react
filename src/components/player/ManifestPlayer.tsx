// Component: ManifestPlayer
// About: This components main purpose is to create our manifestPlayer, it utilizes the player, StreamsGrid and the VideoClient hook in order to achieve this. 

import React, { useEffect, useState } from "react";
import {
  PlayerUiState,
  PlayerUiContext,
  types,
} from "@video/video-client-web";
import { Player } from "./Player";
import useVideoClient from "../../hooks/useVideoClient";
import { streamType, StreamsGrid } from "./StreamsGrid";
import { fetchToken } from "../../utils/token-refresher";

export const ManifestPlayer = () => {
  // Stores the set manifestUrl.
  const [manifestUrl, setManifestUrl] = useState<string>('');
  // Stores the playerUi State.
  const [playerUi, setPlayerUi] = useState<PlayerUiState | null>(null);
  // Stores the access token to view the stream.
  const [token, setToken] = useState<string>('');

  // This is passed down to the child component StreamsGrid in order to allow you to select a stream.
  const selectStream = (stream: streamType): void => {
    setManifestUrl(stream.manifest)
  };

  // Hook that sets up the videoClient, also used in the Encoder.
  const videoClient = useVideoClient('viewer');

  // Async function used to fetch our access token.
  const handleFetchToken = async () => {        
    // Grabbing our streamkey so we can use it in our token request.
    let manifest = manifestUrl.split('=')[0];
    let streamKey: string | string[] = manifest.split('/');
    streamKey = streamKey[streamKey.length - 1];
    streamKey = streamKey.slice(0, streamKey.lastIndexOf('.'));

      const tokenOptions = {
        scopes: ['private-viewer'], // Scope for viewers.
        userId: 'viewer', // Replace this with your userId.
        ttl: 1800, // How long the token lasts, this would be 30 minutes.
        data:{
          displayName:"viewer", // Replace with your displayName.
          streamKey, // The streamKey we extracted from the manifestUrl above.
        }
      };
    // Create our token using our handleFetchToken helper function.
    const token = await fetchToken(tokenOptions);
    // Set it to state
    setToken(token);
    manifest = manifest + "=" + token;
    setManifestUrl(manifest);
  };

  useEffect(() => {
    // Check to make sure we have a videoClient, a manifestUrl and a token before we create our player
    if (videoClient != null && playerUi == null && manifestUrl != '' && token != '') {
      
      // The second argument is the options, for this example we will use the defaults.
      const player: types.PlayerAPI = videoClient.requestPlayer(manifestUrl, {});
      setPlayerUi(new PlayerUiState(player));

      // If we dont have a token but we have a manifest url we need to generate a token first,
    } else if (manifestUrl != '' && token == '') {
      const fetchDataAndUpdateState = async () => {
        await handleFetchToken();
      };
  
      fetchDataAndUpdateState(); 
    }
    return () => {
      // Clear out our state on dismount or change
      setManifestUrl('');
      setToken('');
      // Dispose of our player on dismount or change
      if (playerUi != null) {
        playerUi.dispose();
        setPlayerUi(null);
      }
    };
  }, [videoClient, playerUi, manifestUrl, token]);


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
      <StreamsGrid selectStream={selectStream} />
    </>

    

  );
};

export default ManifestPlayer;