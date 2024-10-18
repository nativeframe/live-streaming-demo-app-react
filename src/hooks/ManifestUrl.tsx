import { useState, useEffect } from 'react';
import { getManifestUrl } from '../utils/streams';



export const useManifestUrl = (streamId: string | undefined): string => {
  const [manifestUrl, setManifestUrl] = useState<string>('');

  useEffect(() => {
    const fetchManifest = async () => {
      // If we don't have a streamId, we can't fetch the manifest URL
      if (!streamId) {
        return
      }

      try {
        const url = await getManifestUrl(streamId);
        setManifestUrl(url);
      } catch (error) {
        console.error('Error fetching manifest URL, stream is either offline or does not exist:', error);
      }
    };

    fetchManifest();

    //Cleanup on unmount or change
    return () => {
        setManifestUrl('');
      };
  }, [streamId]);

  return manifestUrl;
};