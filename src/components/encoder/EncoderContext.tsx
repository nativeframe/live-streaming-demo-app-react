// Component: EncoderContext
// About: This components main purpose is to create the context needed in order for our encoder to function, it utilizes our Encoder and VideoClient.
import {
  EncoderUiState,
  EncoderUiContext,
  VideoClientContext,
  mediaController,
  types,
} from '@video/video-client-web';
import React, { useEffect, useState } from 'react';
import { CallContextWrapper } from './CallContextWrapper';
import { getRandomName } from '../../utils/names';
import useVideoClient from '../../hooks/useVideoClient';
import { serviceEndpoint } from "../../globalConfigs";

interface EncoderContextProps {
  children: React.ReactNode;
}

// React Context instances that manage the VideoClient and EncoderUI instances.
export const EncoderContext: React.FC<EncoderContextProps> = ({ children }) => {
  // State used to store the EncoderUiState.
  const [encoderUi, setEncoderUi] = useState<EncoderUiState | null>(null);
  // State used to store the privateKey generated for our broadcaster.
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  // State used to store the name of our user.
  const [user, setUser] = useState<string | null>(null);

  // Get the private key for our user on mount.
  useEffect(() => {
    getPrivKey();
  }, [])

  // Initialize the EncoderUi instance
  useEffect(() => {
    if (encoderUi == null) {
      (async () => {
        // First create your mediaController and mediaStreamController. In this example we will use the default options. 
        const mediaControllerOptions: types.MediaControllerOptions = {}
        await mediaController.init(mediaControllerOptions);
        const mediaRequestControllerOptions: Partial<types.MediaStreamControllerOptions> = {};
        const mediaStreamController = await mediaController.requestController(mediaRequestControllerOptions);
        // Create our EncoderUiState now that we have our mediaStreamController.
        setEncoderUi(new EncoderUiState(mediaStreamController));
      })();
    }

    return () => {
      if (encoderUi != null) {
        encoderUi.dispose();
        setEncoderUi(null);
      }
    };
  }, [encoderUi]);

  const getPrivKey = async() => {
    // This is just grabbing a random name from our list, all displayNames and userIds should be unique.
    const user = `demoUser${getRandomName()}${Math.floor(Math.random() * 10)}`;
    setUser(user);
    // Fetching our private key for the user we plan to broadcast with.
      await fetch(`${serviceEndpoint}/private-key?user=${user}`)
        .then(response => {
        return response.json();
      })
      .then(data => {
        // Store the private key
        setPrivateKey(data.results.pvtKey);
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  }

  const videoClient = useVideoClient('owner', privateKey, user);

  return (
    videoClient &&
    <VideoClientContext.Provider value={videoClient}>
      <EncoderUiContext.Provider value={encoderUi}>
        <CallContextWrapper>
          {encoderUi != null && children}
        </CallContextWrapper>
      </EncoderUiContext.Provider>
    </VideoClientContext.Provider>
  );
}