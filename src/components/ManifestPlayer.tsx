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
import { usePlayer } from "../hooks/PlayerUi";
import { useManifestUrl } from "../hooks/ManifestUrl";
import { useVideoClient } from "../hooks/VideoClient";

export const ManifestPlayer = () => {
  const playerUi = usePlayer();
  const { streamId } = useVideoClient('viewer');
  const manifestUrl = useManifestUrl(streamId);

  if (!manifestUrl ) {
    return <p>Stream is offline or does not exist</p>
  }

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

export default ManifestPlayer;