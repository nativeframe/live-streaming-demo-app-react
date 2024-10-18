import { CallState } from "@video/video-client-web";
import { useEffect, useState } from "react";

export const useCallState = () => {
  const [callState, setCallState] = useState<CallState | null>(null);


  useEffect(() => {
    const newCallState = new CallState();
    setCallState(newCallState);

    return () => {
      if (newCallState) {
        newCallState.stopBroadcast();
        newCallState.call?.close("Closed by call state on unmount");
        setCallState(null);
      }
    };
  }, []);

  return callState;
};