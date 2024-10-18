const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

// Returns a broadcaster scoped JWT
async function fetchBroadcasterToken(streamId) {
  const user = uuidv4();
  let token;
  const options = {
    kid: process.env.KID,
    videoToken: {
      scopes: ["private-broadcaster"],
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
            clientReferrer: process.env.PROJECT_ID,
          },
        ]
      },
    },
  }
  try {
    token = await fetchVideoToken(options);
  } catch (error) {
    console.error("unable to get access token", {
      error,
    });
    throw error;
  }
  return token;
}

// Returns a viewer scoped JWT
async function fetchViewerToken() {
  const user = uuidv4();
  let token;
  const options = {
    kid: process.env.KID,
    videoToken: {
      scopes: ["private-viewer"],
      userId: user,
      ttl: 3600,
      data: {
        displayName: user,
      },
    },
  }

  try {
    token = await fetchVideoToken(options);
  } catch (error) {
    console.error("unable to get access token", {
      error,
    });
    throw error;
  }

  return token;
}

async function fetchVideoToken(options) {
  try {
    const response = await fetch(`${process.env.BACKEND_ENDPOINT}/auth/v1/video-jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SERVICE_JWT}`
      },
      body: JSON.stringify(options),
    });
    if (response.status !== 201) {
      console.error('Fetch video token status:', response.status);
      throw new Error("Unable to fetch video jwt");
    }
    const body = await response.json();
    return body.token;
  } catch (error) {
    console.error("unable to get video jwt", {
      error,
    });
    throw error;
  }
}

module.exports = {
  fetchBroadcasterToken,
  fetchViewerToken
};