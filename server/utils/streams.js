const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

// Creates a new public stream in the project
async function createStream() {
    const streamId = uuidv4();
    try {
        const options = {
            "streamId": streamId,
            "streamName": streamId,
            "authKey": uuidv4(),
            "authType": "private",
        };

        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/program/api/v1/projects/${process.env.PROJECT_ID}/streams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': uuidv4(),
                'Authorization': `Bearer ${process.env.SERVICE_ACCOUNT_JWT}`
            },
            body: JSON.stringify(options),
        });
        if (response.status !== 201) {
            console.error('Create stream error status:', response.status);
            throw new Error("Unable to create stream");
        }
        const body = await response.json();
        console.log('stream created', body);
        return body.id;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

async function getActiveStreamId() {
    try {
        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/program/api/v1/projects/${process.env.PROJECT_ID}/streams?active=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SERVICE_ACCOUNT_JWT}`
            },
        });
        if (response.status !== 200) {
            console.error('Get active stream ID status:', response.status);
            throw new Error("Unable to get active streams");
        }
        const body = await response.json();
        if (!body.streams?.length) {
            return null;
        }
        const streamId = body.streams[0].id;
        return streamId;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Retrieves the manifest URL from the backend
async function getManifestUrl(streamId) {
    try {
        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/program/api/v1/projects/${process.env.PROJECT_ID}/streams/${streamId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SERVICE_ACCOUNT_JWT}`
            },
        });
        if (response.status !== 200) {
            console.error('Get stream status:', response.status);
            throw new Error("Unable to get requested stream");
        }
        const data = await response.json();
        console.log('stream data', data);
        if (data && data.manifestUrl) {
            return `https://${data.manifestUrl}/live/${streamId}.json`;
        } else {
            console.error('No manifestUrl found');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

module.exports = {
    createStream,
    getActiveStreamId,
    getManifestUrl
};
