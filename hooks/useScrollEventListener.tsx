import { RefCallback, useEffect, useRef } from 'react';

export default function useEventListener(callback: (e: RefCallback<HTMLDivElement>) => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (e: any) => callbackRef.current(e);
    window.addEventListener('scroll', handler);

    return () => window.removeEventListener('scroll', handler);
  }, []);
}
