import { useState, useCallback, useRef, useEffect } from 'react';

export type PingStatus = 'IDLE' | 'SENDING' | 'SEEN_NO_REP' | 'ABORTED';

export function useCancelableMessagePing() {
  const [status, setStatus] = useState<PingStatus>('IDLE');
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendPing = useCallback(() => {
    // Nếu có request cũ đang gửi dở dang, abort ngay lập tức (Slide 33)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setStatus('SENDING');

    const timerId = window.setTimeout(() => {
      if (!controller.signal.aborted) {
        setStatus('SEEN_NO_REP');
      }
    }, 2000);

    controller.signal.addEventListener('abort', () => {
      window.clearTimeout(timerId);
      setStatus('ABORTED');
    });
  }, []);

  const cancelPing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { status, sendPing, cancelPing };
}