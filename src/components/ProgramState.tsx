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
    return <div style={{ color: 'red', padding: '16px' }}>{error}</div>;
  }

  if (!streamStates) {
    return <div>No program state available</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Live Program State</h1>
      <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Program State</h2>
        {Object.keys(streamStates).map((streamId: string) => {
          const streamState = streamStates[streamId];
          const isStopped = streamState?.stopped;
          
          return (
            <div key={streamId} style={{ marginBottom: '16px' }}>
              <button
                style={{
                  marginBottom: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
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
                    style={{
                      marginBottom: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: '8px'
                    }}
                    onClick={() => handleToggleViewer(streamId, viewerId, isViewerStopped)}
                  >
                    {isViewerStopped ? 'Start' : 'Stop'} Viewer {viewerId}
                  </button>
                );
              })}
            </div>
          );
        })}
        <div style={{ marginBottom: '24px' }}>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '16px', 
            borderRadius: '4px', 
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {JSON.stringify({ streamStates, request: requestData, response: responseData }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProgramState; 
