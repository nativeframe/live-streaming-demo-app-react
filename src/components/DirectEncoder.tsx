import {
    EncoderUiContext,
    VideoClientContext,
    CameraButton,
    ControlBar,
    EncoderVideo,
    JoinBroadcastButton,
    MediaContainer,
    MicrophoneButton,
    CallContext,
    types,
    EncoderAudioDeviceSelect,
    EncoderVideoDeviceSelect,
    SettingsSidebar,
  } from '@video/video-client-web';
  import React from 'react';
  import { useCallState } from '../hooks/CallState';
  import useEncoderUi from '../hooks/EncoderUi';

  interface DirectEncoderProps {
    videoClient: types.VideoClientAPI;
    streamId: string;
  }

  const DirectEncoder: React.FC<DirectEncoderProps> = ({ videoClient, streamId }) => {
    const callState = useCallState();
    const encoderUi = useEncoderUi();
  
    if (!videoClient || !streamId || !encoderUi) {
      return <>No streamId or videoClient</>;   
    }
  
    return (
      <VideoClientContext.Provider value={videoClient}>
        <EncoderUiContext.Provider value={encoderUi}>
            <CallContext.Provider value={callState}>
                <MediaContainer>
                <EncoderVideo />
                    <ControlBar variant={"encoder"}>
                        <CameraButton />
                        <MicrophoneButton />
                        <JoinBroadcastButton callId={streamId} broadcastOptions={{ streamName: "default" }}/>
                        <SettingsSidebar>
                            <EncoderVideoDeviceSelect />
                            <EncoderAudioDeviceSelect />
                        </SettingsSidebar>
                    </ControlBar>
                </MediaContainer>
          </CallContext.Provider>
        </EncoderUiContext.Provider>
      </VideoClientContext.Provider>
    );
  }
  
  export default DirectEncoder;
  