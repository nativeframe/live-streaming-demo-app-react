const { setTimeout } = require('timers/promises');

// In-memory storage for stream and viewer states
// For demo purposes only (no memory management)
const streamStates = new Map();
const viewerStates = new Map();

function timeLimitedStream(req, res) {
	const { programs } = req.body;
	const now = Date.now();

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
			// Initialize or update stream state
			if (!streamStates.has(streamId)) {
				streamStates.set(streamId, {
					startTime: Date.now(),
					stopped: false
				});
				setTimeout(() => stopStream(streamId), 120000); // 2 minutes
			}

			const streamState = streamStates.get(streamId);
			const streamRunningTime = (now - streamState.startTime) / 1000; // in seconds

			console.log(`Stream ${streamId} has been running for ${streamRunningTime.toFixed(2)} seconds`);

			const appData = {
				"user.scope": "broadcaster",
				"user.id": "123",
				"user.name": "Bob",
			}

			let token;
			if (stream.token) {
				token = stream.token.value;
			}

			response.programs[programId].streams[streamId] = {
				needAuth: true,
				stop: streamState.stopped,
				stopReason: streamState.stopped ? "Stream duration limit reached" : undefined,
				token: token,
				viewTokens: {},
				appData,
			};

			// Handle view tokens
			if (stream.viewTokens) {
				for (const viewToken of stream.viewTokens) {
					const appData = {
						"user.scope": "viewer",
						"user.id": "123",
						"user.name": "Ben",
					}
					const viewerId = viewToken.value;
					if (!viewerStates.has(viewerId)) {
						viewerStates.set(viewerId, {
							startTime: Date.now(),
							stopped: false,
							appData,
						});
						setTimeout(() => stopViewer(viewerId), 30000); // 30 seconds
					}

					const viewerState = viewerStates.get(viewerId);
					const viewerWatchingTime = (now - viewerState.startTime) / 1000; // in seconds

					console.log(`Viewer ${viewerId} has been viewing for ${viewerWatchingTime.toFixed(2)} seconds`);

					response.programs[programId].streams[streamId].viewTokens[viewerId] = {
						stop: viewerState.stopped,
						stopReason: viewerState.stopped ? "Viewer time limit reached" : undefined,
						appData: viewerState.appData,
					};
				}
			}
		}
	}

	console.log(JSON.stringify(response));
	res.json(response);
}

function stopStream(streamId) {
	const streamState = streamStates.get(streamId);
	if (streamState) {
		streamState.stopped = true;
		console.log(`Stream ${streamId} stopped after 2 minutes`);
	}
}

function stopViewer(viewerId) {
	const viewerState = viewerStates.get(viewerId);
	if (viewerState) {
		viewerState.stopped = true;
		console.log(`Viewer ${viewerId} stopped after 30 seconds`);
	}
}

module.exports = {
	timeLimitedStream
};
