import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  isDark?: boolean;
  isLast?: boolean;
}

export function Hero({ 
  title, 
  subtitle, 
  backgroundImage,
  isDark = false,
  isLast = false 
}: HeroProps) {
  return (
    <section 
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center",
        "snap-start snap-always",
        isLast && "snap-end",
        "transform-gpu perspective-1000"
      )}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform'
        }}
      />
      
      {/* Overlay */}
      <div 
        className={cn(
          "absolute inset-0",
          isDark ? "bg-black/50" : "bg-white/50"
        )}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 
          className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-bold mb-6",
            "transform-gpu transition-all duration-700 ease-out",
            isDark ? "text-white" : "text-gray-900",
            "shadow-text"
          )}
        >
          {title}
        </h1>
        <p 
          className={cn(
            "text-xl sm:text-2xl mb-8",
            isDark ? "text-white/90" : "text-gray-700",
            "transform-gpu transition-all duration-700 delay-100 ease-out",
            "shadow-text"
          )}
        >
          {subtitle}
        </p>
        <div 
          className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center",
            "transform-gpu transition-all duration-700 delay-200 ease-out"
          )}
        >
          <Button variant="primary" size="lg">
            Schedule Demo
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isLast && (
        <div 
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2",
            "animate-bounce",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          <svg 
            className="w-6 h-6"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </section>
  );
}