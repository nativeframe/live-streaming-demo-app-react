// Component: Player
// About: This components main purpose is to import the VideoClient SDK components used in creation of the Player.
import React, { useContext, useEffect } from "react";
import {
  ControlBar,
  MediaContainer,
  PlayerAudioButton,
  PlayerBitrateButton,
  PlayerFullscreenButton,
  PlayerGetSoundButton,
  PlayerOverlayButton,
  PlayerPlayButton,
  PlayerVideo,
  PlayerVolumeRange,
} from "@video/video-client-web";

export const Player = () => {

  return (
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
  );
};
