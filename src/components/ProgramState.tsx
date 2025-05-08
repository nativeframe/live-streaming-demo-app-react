import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/config';

const ProgramState: React.FC = () => {
  const [requestData, setRequestData] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [streamStates, setStreamStates] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramState = async () => {
      try {
        // We are fetching the program state from the server on mount and every 5 seconds
        const response = await fetch(`${API_BASE_URL}/webhook/program-state`);
        const data = await response.json();
        setRequestData(data.request);
        setResponseData(data.response);
        setStreamStates(data.streamStates);
      } catch (err) {
        setError('Failed to fetch program state');
        console.error('Error fetching program state:', err);
      }
    };

    fetchProgramState();
    // You shouldnt need to run an interval like this but it's here for demo purposes to show the program state changing
    const interval = setInterval(fetchProgramState, 5000);

    return () => clearInterval(interval);
  }, []);

  //This toggles the access to a stream by calling the stopStream or startStream endpoint
  const handleToggleStream = async (streamId: string, isStopped: boolean) => {
    const endpoint = isStopped ? 'startStream' : 'stopStream';
    await fetch(`${API_BASE_URL}/webhook/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId }),
    });
  };


  // This toggles the access to a viewer for a stream by calling the stopViewer or startViewer endpoint
  const handleToggleViewer = async (streamId: string, viewerId: string, isStopped: boolean) => {
    const endpoint = isStopped ? 'startViewer' : 'stopViewer';
    await fetch(`${API_BASE_URL}/webhook/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId, viewerId }),
    });
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!streamStates) {
    return <div>No program state available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Live Program State</h1>
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Program State</h2>
        {Object.keys(streamStates).map((streamId: string) => {
          const streamState = streamStates[streamId];
          const isStopped = streamState?.stopped;
          
          return (
            <div key={streamId} className="mb-4">
              <button
                className={`mb-2 px-4 py-2 text-white rounded`}
                onClick={() => handleToggleStream(streamId, isStopped)}
              >
                {isStopped ? 'Start' : 'Stop'} Stream {streamId}
              </button>
              {streamState.viewerStates && Object.keys(streamState.viewerStates).map((viewerId: string) => {
                const viewerState = streamState.viewerStates[viewerId];
                const isViewerStopped = viewerState?.stopped;
                
                return (
                  <button
                    key={viewerId}
                    className={`mb-2 px-4 py-2 text-white rounded`}
                    onClick={() => handleToggleViewer(streamId, viewerId, isViewerStopped)}
                  >
                    {isViewerStopped ? 'Start' : 'Stop'} Viewer {viewerId}
                  </button>
                );
              })}
            </div>
          );
        })}
        <div className="mb-6">
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify({ streamStates, request: requestData, response: responseData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProgramState; 
