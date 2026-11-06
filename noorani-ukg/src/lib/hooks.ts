import { useEffect, useState } from 'react';
import { getBlob } from '../storage/media';

/** Re-render every second while `active`. */
export function useNow(active: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

/** Object URL for a blob stored in IndexedDB. */
export function useBlobUrl(key?: string) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!key) return;
    let revoked = false;
    let objectUrl: string | null = null;
    getBlob(key)
      .then((b) => {
        if (b && !revoked) {
          objectUrl = URL.createObjectURL(b);
          setUrl(objectUrl);
        }
      })
      .catch(() => undefined);
    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [key]);
  return url;
}
