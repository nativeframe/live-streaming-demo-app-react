// For demo purposes only (no memory management)
const streamStates = {};


function parseToken(token) {
	if(token) {
		const parts = token.split('$');
		if (parts.length === 1 && (parts[0] === 'viewer' || parts[0] === 'broadcaster')) {
			return [parts[0], '', '', 'false'];
		}
		if (parts.length === 3) {
			return [...parts, 'false'];
		}
		if (parts.length === 4) {
			return parts;
		}
	}		
	return ['', '', '', 'true'];
}

function getAppDataAndStop(token) {
	const appData = {};
	const [scope, name, userId, stop] = parseToken(token);
	const shouldStop = stop === 'true';

	if (scope) {
		appData['user.scope'] = scope;
		appData['user.name'] = name;
		appData['user.id'] = userId;
	}

	return [appData, shouldStop];
}


// This stops a stream by setting the stopped flag to true
function stopProgramState(streamId) {
	streamStates[streamId] = {
		startTime: Date.now(),
		stopped: true,
		stopReason: "Stream stopped manually",
		viewerStates: {}
	}
}

// This starts a stream by setting the stopped flag to false
function startProgramState(streamId) {
	streamStates[streamId] = {
		startTime: Date.now(),
		stopped: false,
		viewerStates: {}
	};
}

// This stops a viewer for a stream by setting the stopped flag to true
function stopViewerState(streamId, viewerId) {
	streamStates[streamId].viewerStates[viewerId].stopped = true;
}

// This starts a viewer for a stream by setting the stopped flag to false
function startViewerState(streamId, viewerId) {
	streamStates[streamId].viewerStates[viewerId].stopped = false;
}

function updateProgramStates(req, res) {

	const { programs } = req.body;

	const response = {
		programs: {}
	};

	for (const [programId, program] of Object.entries(programs)) {
		response.programs[programId] = {
			stop: false,
			needAuth: true,
			streams: {}
		};

		for (const [streamId, stream] of Object.entries(program.streams)) {
			// Initialize the stream state if it doesn't exist
			if (!streamStates[streamId]) {
				const now = Date.now();
				streamStates[streamId] = {
					startTime: now,
					stopped: false,
					viewerStates: {}
				};
				console.log(`Stream ${streamId} started at ${new Date(now).toISOString()}`);
			}

			const streamState = streamStates[streamId];
			// We use this to remove outdated streams from the streamStates object
			streamState.updatedAt = Date.now();
			
			// This will be the appData for the stream, in this case we hard code values for demo purposes

			let token;
			if (stream.token) {
				token = stream.token.value;
			}

			const [appData] = getAppDataAndStop(token);

			response.programs[programId].streams[streamId] = {
				needAuth: true,
				stop: streamState.stopped,
				stopReason: streamState.stopped ? "Stream stopped" : undefined,
				token: token,
				viewTokens: {},
				appData,
			};

			// Handle view tokens
			if (stream.viewTokens) {
				for (const viewToken of stream.viewTokens) {
					const [appData] = getAppDataAndStop(viewToken.value);
					const viewerId = viewToken.value;
					// Initialize the viewer state if it doesn't exist
					if (!streamState.viewerStates[viewerId]) {
						streamState.viewerStates[viewerId] = {
							startTime: Date.now(),
							stopped: false,
							appData,
						};
						console.log(`Viewer ${viewerId} added to stream ${streamId}`);
					}

					// We use this to remove outdated viewers from the streamStates object
					streamState.viewerStates[viewerId].updatedAt = Date.now();

					// Add the viewer state to the response
					response.programs[programId].streams[streamId].viewTokens[viewerId] = {
						stop: streamState.viewerStates[viewerId].stopped,
						appData: streamState.viewerStates[viewerId].appData,
					};
				}
			}
		}
	}
	res.locals.response = response;
	res.json(response);
}

// This removes outdated streams and viewers from the streamStates object
setInterval(() => {
	for (const streamId in streamStates) {
		//Remove outdated users from streamStates
		for (const viewerId in streamStates[streamId].viewerStates) {
			if (streamStates[streamId].viewerStates[viewerId].updatedAt < Date.now() - 10000) {
				delete streamStates[streamId].viewerStates[viewerId];
			}
		}
		//Remove outdated streams from streamStates
		if (streamStates[streamId].updatedAt < Date.now() - 10000) {
			delete streamStates[streamId];
		}
	}
}, 10000);




module.exports = {
	updateProgramStates,
	stopProgramState,
	streamStates,
	startProgramState,
	stopViewerState,
	startViewerState,
};
