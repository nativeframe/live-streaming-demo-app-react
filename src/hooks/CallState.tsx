import { CallState } from "@video/video-client-web";
import { useEffect, useState } from "react";

export const useCallState = () => {
  const [callState, setCallState] = useState<CallState | null>(null);

  useEffect(() => {
    const newCallState = new CallState();
    setCallState(newCallState);

    // Only cleanup when the component is actually unmounting
    return () => {
      if (newCallState) {
        // Don't automatically stop the broadcast on cleanup
        // Only close the call if it exists
        newCallState.call?.close("Closed by call state on unmount");
        setCallState(null);
      }
    };
  }, []);

  return callState;
};