require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createStream, getActiveStreamId, getManifestUrl } = require('./utils/streams');
const { fetchBroadcasterToken, fetchViewerToken } = require('./utils/userAuth');
const { 
	updateProgramStates,
	stopProgramState,
	streamStates,
	startProgramState,
	stopViewerState,
	startViewerState 
} = require('./utils/programStates');

const app = express();
const port = 3001;

// Store the latest program state
let currentRequest = null;
let currentResponse = null;

app.use(cors());
app.use(express.json());

if (!process.env.BACKEND_ENDPOINT || !process.env.PROJECT_ID || !process.env.SERVICE_ACCOUNT_JWT || !process.env.KID) {
	console.error("please ensure all environment variables are set");
	process.exit(1);
}

// Config route
app.get('/api/config', (req, res) => {
	res.json({
		backendEndpoint: process.env.BACKEND_ENDPOINT,
		projectId: process.env.PROJECT_ID
	});
});

// Streams endpoints
app.post('/api/streams/create', async (req, res) => {
	try {
		const streamId = await createStream();
		res.json({ streamId });
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/streams/active', async (req, res) => {
	try {
		const streamId = await getActiveStreamId();
		res.json({ streamId });
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/streams/:streamId/manifest', async (req, res) => {
	try {
		const { streamId } = req.params;
		const manifestUrl = await getManifestUrl(streamId);
		if (manifestUrl) {
			res.json({ manifestUrl });
		} else {
			throw new Error('No manifestUrl found');
		}
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({ error: error.message });
	}
});

// UserAuth endpoints
app.post('/api/auth/broadcaster', async (req, res) => {
	try {
		const { streamId } = req.body;
		const token = await fetchBroadcasterToken(streamId);
		res.json({ token });
	} catch (error) {
		console.error("unable to get access token", error);
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/auth/viewer', async (req, res) => {
	try {
		const token = await fetchViewerToken();
		res.json({ token });
	} catch (error) {
		console.error("unable to get access token", error);
		res.status(500).json({ error: error.message });
	}
});

// Webhook endpoint for program states
app.post('/api/webhook/updateProgramStates', (req, res) => {
	console.log('Webhook called with body:', JSON.stringify(req.body));
	currentRequest = req.body;
	updateProgramStates(req, res);
	currentResponse = res.locals.response;
});

// Endpoint to get current program state, streamStates, request and response
app.get('/api/webhook/program-state', (req, res) => {
	res.json({
		request: currentRequest,
		response: currentResponse,
		streamStates: streamStates
	});
});

// Endpoint to stop a stream
app.post('/api/webhook/stopStream', (req, res) => {
	const { streamId } = req.body;
	stopProgramState(streamId);
	res.json({ message: 'Stream stopped' });
});

// Endpoint to start a stream
app.post('/api/webhook/startStream', (req, res) => {
	const { streamId } = req.body;
	startProgramState(streamId);
	res.json({ message: 'Stream started' });
});

// Endpoint to stop a viewer
app.post('/api/webhook/stopViewer', (req, res) => {
	const { streamId, viewerId } = req.body;
	stopViewerState(streamId, viewerId);
	console.log("Viewer stopped", viewerId, "for stream", streamId);
	res.json({ message: 'Viewer stopped' });
});

// Endpoint to start a viewer
app.post('/api/webhook/startViewer', (req, res) => {
	const { streamId, viewerId } = req.body;
	startViewerState(streamId, viewerId);
	res.json({ message: 'Viewer started' });
});


app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});