import { VideoClient, types } from '@video/video-client-web';
import { useState, useEffect } from 'react';
import { tokenRefresher } from '../utils/token-refresher';
import { backendEndpoint } from '../globalConfigs';
import { createStream, getKID } from '../utils/auth';
import { getRandomName } from '../utils/names';

const useVideoClient = (scope: string, streamId?: string | null, user?: string | null) => {
  const [videoClient, setVideoClient] = useState<types.VideoClientAPI | null>(null);

  useEffect(() => {
    if (!videoClient) {
      let token;

      if (!streamId) {
        if (!user) {
          user = getRandomName();
        }
        streamId = await createStream(user);
      }

      const kid = await getKID();

      // Only broadcasters need a token refresher
      if (user && streamId && kid) {
        token = tokenRefresher(user, streamId, kid);
      }
      // Setting the generated token and the backendEndpoint for the options to be passed to our new VideoClient instance
      const videoClientOptions: types.VideoClientOptions = {
        backendEndpoints: [backendEndpoint],
        token: token
      };
      const newVC = new VideoClient(videoClientOptions);
      

      setVideoClient(newVC);
    }
    
    return () => {
      if (videoClient) {
        videoClient.dispose();
        setVideoClient(null);
      }
    };
  }, [videoClient, streamId]);

  return videoClient;
};

export default useVideoClient;
