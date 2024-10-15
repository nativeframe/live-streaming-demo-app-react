// Component: EncoderContext
// About: This components main purpose is to create the context needed in order for our encoder to function, it utilizes our Encoder and VideoClient.
import {
  EncoderUiState,
  EncoderUiContext,
  VideoClientContext,
  mediaController,
  types,
  CameraButton,
  ControlBar,
  EncoderAudioDeviceSelect,
  EncoderResolutionSelect,
  EncoderVideo,
  EncoderVideoDeviceSelect,
  FullscreenButton,
  JoinBroadcastButton,
  MediaContainer,
  MicrophoneButton,
  ScreenCaptureButton,
  SettingsButton,
  SettingsSidebar,
} from '@video/video-client-web';
import React, { useEffect, useState, useCallback } from 'react';
import { CallContextWrapper } from './CallContextWrapper';
import { useVideoClient, createToken } from '../../hooks/useVideoClient';
import { getRandomName } from '../../utils/names';

// React Context instances that manage the VideoClient and EncoderUI instances.
const EncoderContext = (): React.ReactElement => {
  // State used to store the EncoderUiState.
  const [encoderUi, setEncoderUi] = useState<EncoderUiState | null>(null);
  const [streamId, setStreamId] = useState<string | undefined>("");
  const [videoClient, setVideoClient] = useState<types.VideoClientAPI | null>(null);
  const [token, setToken] = useState<Promise<any> | undefined>(undefined);
  const fetchToken = useCallback(async () => {
    const { token, streamId } = await createToken(getRandomName(), "broadcaster");
    setToken(token);
    setStreamId(streamId || "");
  }, []);
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  useEffect(() => {
    if (token) {
      setVideoClient(useVideoClient(token));
    }
    return () => {
      videoClient?.dispose();
      setVideoClient(null);
    };
  }, [token]);

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

  if (!videoClient || !streamId) {
    return <></>;
  }

  return (
    <VideoClientContext.Provider value={videoClient}>
      <EncoderUiContext.Provider value={encoderUi}>
        <CallContextWrapper>
          {encoderUi != null && <div className="encoder">
          <MediaContainer>
            <EncoderVideo />
            <ControlBar variant={"encoder"}>
              <CameraButton />
              <MicrophoneButton />
              <JoinBroadcastButton setCallId={()=> {}} broadcastOptions={{ streamName: streamId }} />
              <ScreenCaptureButton />
              <FullscreenButton />
              <SettingsButton />
            </ControlBar>
            <SettingsSidebar>
              <div>
                <EncoderVideoDeviceSelect />
                <EncoderAudioDeviceSelect />
                <EncoderResolutionSelect />
              </div>
            </SettingsSidebar>
          </MediaContainer>
      </div>
      }
        </CallContextWrapper>
      </EncoderUiContext.Provider>
    </VideoClientContext.Provider>
  );
}

export default React.memo(EncoderContext);
