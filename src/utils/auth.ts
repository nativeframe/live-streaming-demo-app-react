import { backendEndpoint, projectId } from "../globalConfigs";

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

// Retrieves the KID from the project, used to generate a token
export async function getKID(): Promise<string> {
    let kid;
    try {
        const response = await fetch(`${backendEndpoint}/auth/v1/jwks?iss=nativeframe?project=${projectId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        const body = await response.json();
        kid = body.keys[0].kid;
    } catch (error: any) {
        console.error('Error:', error.message);
        throw error;
    }
    return kid;
}