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
  PlayerUiState,
  PlayerUiContext,
  PlayerOverlayButton,
  PlayerFullscreenButton,
  PlayerBitrateButton,
  PlayerVolumeRange,
  PlayerAudioButton,
  PlayerPlayButton,
  PlayerGetSoundButton,
  PlayerVideo,
} from '@video/video-client-web';
import React, { useEffect, useState } from 'react';
import { useCallState } from '../hooks/CallState';
import useEncoderUi from '../hooks/EncoderUi';
import { useVideoClient } from '../hooks/VideoClient';

const Encoder = (): React.ReactElement => {
  const { streamId, videoClient } = useVideoClient("broadcaster");
  const callState = useCallState();
  const encoderUi = useEncoderUi();
  const [playerUi, setPlayerUi] = useState<PlayerUiState | null>(null);

  useEffect(() => {
    if (!videoClient) return;

    let handled = false;
    const handlePlayerAdded = (event: { player: any }) => {
      if (!handled) {
        setPlayerUi(new PlayerUiState(event.player));
        handled = true;
        console.log('playerAdded', event);
      }
    };

    videoClient.on('playerAdded', handlePlayerAdded);

    return () => {
      videoClient.off('playerAdded', handlePlayerAdded);
      if (playerUi) {
        playerUi.dispose("Cleaning up playerUi on unmount");
        setPlayerUi(null);
      }
    };
  }, [videoClient]);

  if (!videoClient || !streamId) {
    return <>No streamId or videoClient</>;   
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
    <VideoClientContext.Provider value={videoClient}>
      <EncoderUiContext.Provider value={encoderUi}>
      <CallContext.Provider value={callState}>
          {encoderUi != null &&
            <MediaContainer>
              <EncoderVideo />
              <ControlBar variant={"encoder"}>
                <CameraButton />
                <MicrophoneButton />
                <JoinBroadcastButton setCallId={() => { }} broadcastOptions={{ streamName: streamId }}  streamKey={streamId}/>
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
          }
        </CallContext.Provider>
      </EncoderUiContext.Provider>
    </VideoClientContext.Provider>
    <>
        {playerUi && (
          <PlayerUiContext.Provider value={playerUi}>
            <MediaContainer>
              <PlayerGetSoundButton />
              <PlayerVideo />
              <ControlBar variant="player">
                <PlayerPlayButton />
                <PlayerAudioButton />
                <PlayerVolumeRange />
                <PlayerBitrateButton />
                <PlayerFullscreenButton />
              </ControlBar>
              <PlayerOverlayButton />
            </MediaContainer>
          </PlayerUiContext.Provider>
        )}
      </> 
    </div>
  );
}

export default Encoder;
