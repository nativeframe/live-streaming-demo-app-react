import React, { useEffect } from "react";
import { 
  ControlBar,
  MediaContainer,
  PlayerAudioButton,
  PlayerBitrateButton,
  PlayerFullscreenButton,
  PlayerGetSoundButton,
  PlayerOverlayButton,
  PlayerPlayButton,
  PlayerUiContext,
  PlayerUiState,
  PlayerVideo,
  PlayerVolumeRange 
} from "@video/video-client-web";
import { useVideoPlayer } from "../hooks/Player";

interface PlayerProps {
  token: string;
  onReady?: (videoClient: any, streamId: string) => void;
}

export const Player: React.FC<PlayerProps> = ({ token, onReady }) => {
  const { playerUi, videoClient, streamId } = useVideoPlayer(token);

  useEffect(() => {
    if (videoClient && streamId && onReady) {
      onReady(videoClient, streamId);
    }
  }, [videoClient, streamId, onReady]);

  return (
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
  );
};

export default Player;