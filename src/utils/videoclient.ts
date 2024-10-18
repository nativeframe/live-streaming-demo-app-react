import { VideoClient, types } from '@video/video-client-web';
import { getConfig } from './streams';
import { v4 as uuidv4 } from 'uuid';

export const initVideoClient = async (token: string | any) => {
	const config = await getConfig();
	let user = uuidv4();

	// Setting the generated token and the backendEndpoint for the options to be passed to our new VideoClient instance
	const videoClientOptions: types.VideoClientOptions = {
		backendEndpoints: [config.backendEndpoint],
		token: token,
		userId: user,
	};
	const newVC = new VideoClient(videoClientOptions);
	return newVC;
}