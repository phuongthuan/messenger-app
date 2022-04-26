import { useEffect, useRef } from 'react';

export default function useEventListener(eventType: string, callback: (e: any) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: any) => callbackRef.current(e);
    window.addEventListener(eventType, handler);

    return () => window.removeEventListener(eventType, handler);
  }, [eventType]);
}
