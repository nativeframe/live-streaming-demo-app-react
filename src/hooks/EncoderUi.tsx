import { useState, useEffect } from 'react';
import { EncoderUiState, mediaController, types } from '@video/video-client-web'

function useEncoderUi() {
  const [encoderUi, setEncoderUi] = useState<EncoderUiState | null>(null);

  useEffect(() => {
    const initializeEncoderUi = async () => {
      // First create your mediaController and mediaStreamController. In this example we will use the default options. 
      const mediaControllerOptions: types.MediaControllerOptions = {}
      await mediaController.init(mediaControllerOptions);
      const mediaRequestControllerOptions: Partial<types.MediaStreamControllerOptions> = {};
      const mediaStreamController = await mediaController.requestController(mediaRequestControllerOptions);
      // Create our EncoderUiState now that we have our mediaStreamController.
      setEncoderUi(new EncoderUiState(mediaStreamController));
    };

    if (encoderUi == null) {
      initializeEncoderUi();
    }

    return () => {
      if (encoderUi != null) {
        encoderUi.dispose("Cleaning up encoderUi on unmount or change");
        setEncoderUi(null);
      }
    };
  }, []);

  return encoderUi;
}

export default useEncoderUi;