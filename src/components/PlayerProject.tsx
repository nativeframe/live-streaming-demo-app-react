import React, { useState } from "react";
import Player from "./Player";
import DirectEncoder from "./DirectEncoder";

export const PlayerProject: React.FC = () => {
  const [token, setToken] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [videoClient, setVideoClient] = useState<any>(null);
  const [streamId, setStreamId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handlePlayerReady = (vc: any, sid: string) => {
    setVideoClient(vc);
    setStreamId(sid);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="token">Token</label>
        <input
          type="text"
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your token"
        />
        <button type="submit">Submit</button>
      </form>
      <div style={{ marginTop: "20px" }}>
        {isSubmitted && (
          <div style={{ marginBottom: "20px" }}>
            <Player token={token} onReady={handlePlayerReady} />
          </div>
        )}
        {isSubmitted && videoClient && streamId && (
          <DirectEncoder videoClient={videoClient} streamId={streamId} />
        )}
      </div>
    </div> 
  );
};

export default PlayerProject; 