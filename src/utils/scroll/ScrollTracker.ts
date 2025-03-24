import { debounce } from './debounce';

interface ScrollFrame {
  index: number;
  progress: number;
}

export class ScrollTracker {
  private observer: IntersectionObserver;
  private sections: Element[] = [];
  private onUpdate: (frame: ScrollFrame) => void;
  private totalFrames: number;
  private touchStartY: number | null = null;
  private lastScrollTime: number = 0;
  private scrollVelocity: number = 0;

  constructor(totalFrames: number, onUpdate: (frame: ScrollFrame) => void) {
    this.totalFrames = totalFrames;
    this.onUpdate = onUpdate;

    // Create thresholds array for smooth tracking
    const thresholds = Array.from({ length: 100 }, (_, i) => i / 100);

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: thresholds }
    );

    // Initialize event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      window.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }
  }

  private handleIntersection = debounce((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.intersectionRatio;
        const frameIndex = Math.floor(progress * this.totalFrames);
        
        // Apply momentum-based smoothing
        const now = performance.now();
        const timeDelta = now - this.lastScrollTime;
        const velocityFactor = Math.min(Math.abs(this.scrollVelocity) / 1000, 1);
        
        // Smooth out the frame transition based on velocity
        const smoothedFrame = {
          index: frameIndex,
          progress: progress + (velocityFactor * Math.sign(this.scrollVelocity))
        };

        this.onUpdate(smoothedFrame);
      }
    });
  }, 16); // 60fps debounce

  private handleScroll = () => {
    const now = performance.now();
    const timeDelta = now - this.lastScrollTime;
    
    if (timeDelta > 0) {
      const scrollDelta = window.scrollY - this.lastScrollPosition;
      this.scrollVelocity = scrollDelta / timeDelta;
      this.lastScrollTime = now;
      this.lastScrollPosition = window.scrollY;
    }
  };

  private lastScrollPosition: number = 0;

  private handleTouchStart(e: TouchEvent) {
    this.touchStartY = e.touches[0].clientY;
    this.scrollVelocity = 0;
  }

  private handleTouchMove(e: TouchEvent) {
    if (this.touchStartY === null) return;

    const touchDelta = e.touches[0].clientY - this.touchStartY;
    this.scrollVelocity = touchDelta / 16; // Approximate frame time
    
    // Prevent default only if we're in a tracked section
    if (this.isInTrackedSection(e.target as Element)) {
      e.preventDefault();
    }
  }

  private handleTouchEnd() {
    this.touchStartY = null;
    
    // Apply deceleration
    const decelerate = () => {
      if (Math.abs(this.scrollVelocity) > 0.1) {
        this.scrollVelocity *= 0.95;
        requestAnimationFrame(decelerate);
      } else {
        this.scrollVelocity = 0;
      }
    };
    
    requestAnimationFrame(decelerate);
  }

  private isInTrackedSection(element: Element): boolean {
    return this.sections.some(section => section.contains(element));
  }

  public observe(element: Element) {
    this.sections.push(element);
    this.observer.observe(element);
  }

  public unobserve(element: Element) {
    const index = this.sections.indexOf(element);
    if (index > -1) {
      this.sections.splice(index, 1);
    }
    this.observer.unobserve(element);
  }

  public destroy() {
    this.sections.forEach(section => this.observer.unobserve(section));
    this.sections = [];
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      window.removeEventListener('touchmove', this.handleTouchMove.bind(this));
      window.removeEventListener('touchend', this.handleTouchEnd.bind(this));
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }
}