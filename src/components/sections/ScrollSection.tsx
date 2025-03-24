import React, { useRef, useState } from 'react';
import { useScrollTracking } from '../../hooks/useScrollTracking';
import { cn } from '../../utils/cn';

interface ScrollSectionProps {
  className?: string;
  children?: React.ReactNode;
  frames: string[]; // URLs of frame images
}

export function ScrollSection({ className, children, frames }: ScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useScrollTracking(sectionRef, {
    totalFrames: frames.length,
    onUpdate: ({ index, progress }) => {
      setCurrentFrame(index);
      setOpacity(1 - Math.abs(progress - Math.floor(progress)));
    }
  });

  return (
    <div
      ref={sectionRef}
      className={cn(
        "relative h-screen w-full overflow-hidden",
        "touch-action-none gpu-accelerated",
        className
      )}
    >
      <div className="absolute inset-0 w-full h-full">
        {/* Current frame */}
        <img
          src={frames[currentFrame]}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity }}
        />
        
        {/* Next frame (for smooth transitions) */}
        {currentFrame < frames.length - 1 && (
          <img
            src={frames[currentFrame + 1]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 1 - opacity }}
          />
        )}
      </div>
      
      {children}
    </div>
  );
}