// Utility: tokenRefresher
// About: The main purpose of this utility is to create the token refresher necessary to create valid tokens for the Video Client.
import { backendEndpoint, serviceJwt, projectId } from "../globalConfigs";
interface tokenOptions {
  kid: string;
  videoToken: {
    scopes: string[];
    userId: string;
    ttl: number;
    data: {
      displayName: string;
      mirrors?: {
        id: string;
        streamName: string;
        kind: string;
        clientEncoder: string;
        streamKey: string;
        clientReferrer: string;
      }[];
    };
  };
}

// Functions as a Refresher for fetching our token
export const tokenRefresher = (user: string, streamId: string, kid: string) => {
  // You need to return a promise for this to work properly
  return async () => {
    let token;
    // These options are setup for a broadcaster
    const options = {
      kid,
      videoToken: {
        scopes: ["broadcaster"],
        userId: user,
        ttl: 86400,
        data: {
          displayName: streamId,
          mirrors: [
            {
              id: streamId,
              streamName: streamId,
              kind: "pipe",
              clientEncoder: "SaaS",
              streamKey: streamId,
              clientReferrer: projectId,
            },
          ],
        },
      },
    };
    try {
      token = await fetchToken(options);
    } catch (error) {
      console.error("unable to get access token", {
        error,
      });
      throw error;
    }
    return token;
  };
};

export const fetchToken = async (options: tokenOptions) => {
  try {
    const response = await fetch(`${backendEndpoint}/auth/v1/video-jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceJwt}`
      },
      body: JSON.stringify(options),
    });
    const body = await response.json();
    return body.token;
  } catch (error) {
    console.error("unable to get access token", {
      error,
    });
    throw error;
  }
};
