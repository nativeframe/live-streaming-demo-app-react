import { CallContext, CallState } from "@video/video-client-web";
import React, { useCallback, useEffect, useState } from "react";

interface CallContextWrapperProps {
  children: React.ReactNode;
}

// Required for the JoinBroadcastButton to work
export const CallContextWrapper: React.FC<CallContextWrapperProps> = ({ children }) => {
  const [callState, setCallState] = useState<CallState | null>(null);
  const [rebuildCallSwitch, setRebuildCallSwitch] = useState(false);

  const triggerSwitch = useCallback(() => {
    setRebuildCallSwitch((prev) => !prev);
  }, []);

  useEffect(() => {
    setCallState(new CallState());

    return () => {
      if (callState) {
        callState.stopBroadcast();
        callState.call?.close("Closed by call state on unmount");
      }
    };
  }, [rebuildCallSwitch]);

  useEffect(() => {
    callState?.call?.on("callClosed", triggerSwitch);

    return () => {
      callState?.call?.removeListener("callClosed", triggerSwitch);
    };
  }, [callState?.call, triggerSwitch]);

  return <CallContext.Provider value={callState}>{callState && children}</CallContext.Provider>;
}
