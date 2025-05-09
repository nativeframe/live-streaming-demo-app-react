import { AlwaysAuthClient, VideoClient, types } from '@video/video-client-web';
import { getConfig } from './streams';
import { v4 as uuidv4 } from 'uuid';

export const initVideoClient = async (token?: string | any, authClient?: AlwaysAuthClient) => {
	const config = await getConfig();
	let user = uuidv4();
	

	// Setting the generated token and the backendEndpoint for the options to be passed to our new VideoClient instance
	const videoClientOptions: types.VideoClientOptions = {
		backendEndpoints: [config.backendEndpoint],
		token: token,	
		auth: authClient,
		userId: user,
		projectId: config.projectId
	};
	
	const newVC = new VideoClient(videoClientOptions);
	return newVC;
}