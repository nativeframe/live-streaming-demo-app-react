import { API_BASE_URL } from './config';

export async function createStream(): Promise<string> {
    const activeStream = localStorage.getItem("stream");
    if (activeStream) {
        return activeStream;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/streams/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to create stream');
        }

        const data: { streamId: string } = await response.json();
        localStorage.setItem("stream", data.streamId);
        return data.streamId;
    } catch (error) {
        console.error('Error creating stream:', error);
        throw error;
    }
}

export async function getActiveStreamId(): Promise<string | null> {
    const activeStream = localStorage.getItem("stream");
    if (activeStream) {
        return activeStream;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/streams/active`);

        if (!response.ok) {
            throw new Error('Failed to get active stream ID');
        }

        const data: { streamId: string | null } = await response.json();
        if (data.streamId) {
            localStorage.setItem("stream", data.streamId);
        }
        return data.streamId;
    } catch (error) {
        console.error('Error getting active stream ID:', error);
        throw error;
    }
}

export async function getManifestUrl(streamId: string): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/streams/${streamId}/manifest`);

        if (!response.ok) {
            throw new Error('Failed to get manifest URL');
        }

        const data: { manifestUrl: string } = await response.json();
        return data.manifestUrl;
    } catch (error) {
        console.error('Error getting manifest URL:', error);
        throw error;
    }
}

interface Config {
    backendEndpoint: string;
    projectId: string;
}

export async function getConfig(): Promise<Config> {
    try {
        const response = await fetch(`${API_BASE_URL}/config`);

        if (!response.ok) {
            throw new Error('Failed to get config');
        }

        const data: Config = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting config:', error);
        throw error;
    }
}