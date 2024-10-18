require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createStream, getActiveStreamId, getManifestUrl } = require('./utils/streams');
const { fetchBroadcasterToken, fetchViewerToken } = require('./utils/userAuth');
const { timeLimitedStream } = require('./utils/programStates');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

app.post('/api/auth/program-states', async (req, res) => {
	try {
		const resp = await programStatesWebhook();
		res.json({ token });
	} catch (error) {
		console.error("unable to get access token", error);
		res.status(500).json({ error: error.message });
	}
});

app.post('/api/webhook/timeLimitedStream', timeLimitedStream);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});