// Component: EncoderContext
// About: This components main purpose is to create the context needed in order for our encoder to function, it utilizes our Encoder and VideoClient.
import {
  EncoderUiContext,
  VideoClientContext,
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
  CallContext,
} from '@video/video-client-web';
import React from 'react';
import { useCallState } from '../hooks/CallState';
import useEncoderUi from '../hooks/EncoderUi';
import { useVideoClient } from '../hooks/VideoClient';

const Encoder = (): React.ReactElement => {
  const { streamId, videoClient } = useVideoClient("broadcaster");
  const callState = useCallState();
  const encoderUi = useEncoderUi();


  if (!videoClient || !streamId) {
    return <>No streamId or videoClient</>;   
  }

  return (
    <VideoClientContext.Provider value={videoClient}>
      <EncoderUiContext.Provider value={encoderUi}>
      <CallContext.Provider value={callState}>
          {encoderUi != null && <div className="encoder">
            <MediaContainer>
              <EncoderVideo />
              <ControlBar variant={"encoder"}>
                <CameraButton />
                <MicrophoneButton />
                <JoinBroadcastButton setCallId={() => { }} broadcastOptions={{ streamName: streamId }} />
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
        </CallContext.Provider>
      </EncoderUiContext.Provider>
    </VideoClientContext.Provider>
  );
}

export default Encoder;
