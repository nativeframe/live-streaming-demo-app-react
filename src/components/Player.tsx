import React from "react";
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
  PlayerVideo,
  PlayerVolumeRange 
} from "@video/video-client-web";
import { useVideoPlayer } from "../hooks/Player";

interface PlayerProps {
  projectId: string;
}

export const Player: React.FC<PlayerProps> = ({ projectId }) => {

  const playerUi = useVideoPlayer(projectId);

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