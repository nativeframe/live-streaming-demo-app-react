import { backendEndpoint, projectId, serviceJwt } from "../globalConfigs";

// Creates a new public stream in the project
export async function createStream(user: string): Promise<string> {
    // Create stream
    let streamId;
    try {
        const options = {
            "streamId": "",
            "userId": user,
            "authType": "public",
            "roles": ["broadcaster"]
        };
        const response = await fetch(`${backendEndpoint}/program/api/v1/projects/${projectId}/create-claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(options),
        });
        const body = await response.json();
        streamId = body["@nativeframe"].streamId;
        return streamId;
    } catch (error: any) {
        console.error('Error:', error.message);
        throw error;
    }
}

export async function getActiveStreamId(): Promise<string> {
    try {
        const response = await fetch(`${backendEndpoint}/program/api/v1/projects/${projectId}/streams?active=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${serviceJwt}`
            },
        });
        const body = await response.json();
        if (body.streams.length === 0) {
            throw new Error('No active streams found');
        }
        const streamId = body.streams[0].id;
        return streamId;
    } catch (error: any) {
        console.error('Error:', error.message);
        throw error;
    }
}