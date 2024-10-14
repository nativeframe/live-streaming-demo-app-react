// Component: ViewersDisplay
// About: This components main purpose is to display the viewer ids watching the broadcast.
import React, { useEffect, useState } from 'react';
import { serviceEndpoint } from '../../globalConfigs';

interface ViewersResponse {
  callId: string;
  viewers: string[];
}

interface ViewersDisplayProps {
  callId: string | null;
}

export const ViewersDisplay: React.FC<ViewersDisplayProps> = ({ callId }) => {
  const [viewers, setViewers] = useState<string[]>([]);

  // To fetch the viewers watching the broadcast
  useEffect(() => {
    const fetchViewers = async () => {
      try {
        const response = await fetch(`${serviceEndpoint}/viewers-watching/?callId=${callId}`);
        const data: ViewersResponse = await response.json();
        setViewers(data.viewers);
      } catch (error) {
        console.error('Failed to fetch viewers', error);
      }
    };

    let intervalId: NodeJS.Timeout;
    if (callId) {
      fetchViewers();
      intervalId = setInterval(fetchViewers, 5000); // Poll every 5 seconds
    } else {
      setViewers([]);
    }
    
    return () => clearInterval(intervalId); // Cleanup on unmount or callId change
  }, [callId]);

  if (!viewers.length) {
    return null;
  }

  return (
    <div>
      <h2>Viewers watching</h2>
      <ul>
        {viewers.map((viewer, index) => (
          <li key={index}>{viewer}</li>
        ))}
      </ul>
    </div>
  );
};