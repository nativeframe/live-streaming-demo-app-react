import React, { useState } from "react";
import Player from "./Player";

export const PlayerProject: React.FC = () => {
  const [token, setToken] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "32px auto" }}>
      {isSubmitted && <Player projectId={token} />}
      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <label htmlFor="token">Token</label>
        <input
          type="text"
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your token"
          style={{ display: "block", margin: "8px 0 16px 0", width: "100%" }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PlayerProject; 