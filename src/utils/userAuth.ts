const API_BASE_URL = 'http://localhost:3001/api'; // Adjust this if your server is on a different port or host

export const fetchBroadcasterToken = async (streamId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/broadcaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ streamId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch broadcaster token');
    }

    const data: { token: string } = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching broadcaster token:', error);
    throw error;
  }
};

export const fetchViewerToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/viewer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch viewer token');
    }

    const data: { token: string } = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching viewer token:', error);
    throw error;
  }
};