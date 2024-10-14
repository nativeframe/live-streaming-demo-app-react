// Component: Encoder
// About: This components main purpose is to import the VideoClient SDK components used in creation of the Encoder.
import {
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
} from "@video/video-client-web";
import React, { useState } from "react";
import { EncoderContext } from "./EncoderContext";
import { ViewersDisplay } from "./ViewersDisplay";

export const Encoder: React.FC = () => {
  const [callId, setCallId] = useState<string | null>(null);
  
  return (
    <EncoderContext>
      <div className="encoder">
        <MediaContainer>
          <EncoderVideo />
          <ControlBar variant={"encoder"}>
            <CameraButton />
            <MicrophoneButton />
            <JoinBroadcastButton 
              broadcastOptions={{ streamName: "demo" }} 
              setCallId={setCallId}
            />
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
      <ViewersDisplay callId={callId} />
    </EncoderContext>
  );
};
