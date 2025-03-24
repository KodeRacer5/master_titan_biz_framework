import { useEffect, useRef } from 'react';
import { ScrollTracker } from '../utils/scroll/ScrollTracker';

interface ScrollTrackingOptions {
  totalFrames: number;
  onUpdate: (frame: { index: number; progress: number }) => void;
}

export function useScrollTracking(
  elementRef: React.RefObject<HTMLElement>,
  options: ScrollTrackingOptions
) {
  const trackerRef = useRef<ScrollTracker | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Initialize tracker
    trackerRef.current = new ScrollTracker(
      options.totalFrames,
      options.onUpdate
    );

    // Start observing
    trackerRef.current.observe(elementRef.current);

    // Preload first 3 frames
    for (let i = 0; i < 3; i++) {
      options.onUpdate({ index: i, progress: i / options.totalFrames });
    }

    return () => {
      trackerRef.current?.destroy();
    };
  }, [options.totalFrames, options.onUpdate]);

  return trackerRef.current;
}