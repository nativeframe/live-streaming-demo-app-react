import { VideoClient, types } from '@video/video-client-web';
import { tokenRefresher } from '../utils/auth';
import { backendEndpoint } from '../globalConfigs';
import { createStream } from '../utils/streams';
import { getRandomName } from '../utils/names';

export const useVideoClient = (token: string | any) => {
  let user = getRandomName();

  // Setting the generated token and the backendEndpoint for the options to be passed to our new VideoClient instance
  const videoClientOptions: types.VideoClientOptions = {
    backendEndpoints: [backendEndpoint],
    token: token,
    userId: user,
  };
  const newVC = new VideoClient(videoClientOptions);

  return newVC;
}

export const createToken = async (user: string, scope: string) => {
  const streamId = await createStream(user);
  const token = await tokenRefresher(user, streamId, scope);
  return { token, streamId };
}