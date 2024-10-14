// Component: StreamsGrid
// About: This components main purpose is to grab all streams from your selected environment and populate them in a selectable grid.
import React, { useState, useEffect } from 'react';
import { serviceEndpoint } from '../../globalConfigs';

export interface streamType {
    pubKey: string,
    manifest: string,
    startTime: string,
    endTime: string | null,
    duration: string | null,
    broadcasterId: string,
    userId: string,
    broadcastId: string,
}

interface props {
    selectStream: (stream: streamType) => void;
}



export const StreamsGrid: React.FC<props> = ({ selectStream }) => {
// State to hold the list of available streams
  const [streams, setStreams] = useState<streamType[]>([]);

  const handleButtonClick = async () => {
    try {
        const response = await fetch(`${serviceEndpoint}/live-streams`);
        const data = await response.json();

        // Store the results for the streams.
        setStreams(data.results)

      } catch (error) {
        console.error('Fetch error:', error);
      }
  };

  return (
    <div>
        <button onClick={handleButtonClick}>Fetch Streams</button>
        <br/>
        <br/>
        <table>
            <tbody>
            {streams.length >= 1 ?
                streams.map((stream, index) => (
                <tr style={{cursor: "pointer"}} key={index} onClick={() => selectStream(stream)}>
                    <td>Stream userId: {stream?.userId}</td> 
                </tr>
            ))
            :
                <div>
                    No Streams Available, please click the Fetch Streams button to refresh
                </div>
        }
            </tbody>
        </table>
    </div>
  );
};

export default StreamsGrid;
