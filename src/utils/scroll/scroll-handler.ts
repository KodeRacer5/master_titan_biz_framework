import { debounce } from './debounce';

// Ensure the code only runs in browser environment
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  class ScrollHandler {
    private sections: HTMLElement[] = [];
    private currentSection: number = 0;
    private isScrolling: boolean = false;
    private touchStartY: number | null = null;
    private touchStartX: number | null = null;
    private lastScrollTime: number = Date.now();
    private scrollTimeout: number | null = null;
    private scrollVelocity: number = 0;
    private lastTouchY: number = 0;
    private rafId: number | null = null;

    constructor() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initialize());
      } else {
        this.initialize();
      }
    }

    private initialize(): void {
      this.sections = Array.from(document.querySelectorAll('[data-section-id]'));
      
      window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
      window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      window.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
      
      this.setupIntersectionObserver();
      this.activateSection(0);
    }

    private handleWheel = debounce((e: WheelEvent): void => {
      if (this.isScrolling || this.shouldIgnoreScroll()) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const now = Date.now();
      
      if (now - this.lastScrollTime > 800) {
        this.navigateSection(direction);
        this.lastScrollTime = now;
      }
    }, 50);

    private handleTouchStart(e: TouchEvent): void {
      this.touchStartY = e.touches[0].clientY;
      this.touchStartX = e.touches[0].clientX;
      this.lastTouchY = this.touchStartY;
      this.scrollVelocity = 0;
    }

    private handleTouchMove(e: TouchEvent): void {
      if (!this.touchStartY || !this.touchStartX || this.shouldIgnoreScroll()) return;
      
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = this.touchStartY - touchY;
      const deltaX = Math.abs(this.touchStartX - touchX);
      
      // Calculate velocity
      const deltaTime = e.timeStamp - this.lastScrollTime;
      this.scrollVelocity = (this.lastTouchY - touchY) / deltaTime;
      this.lastTouchY = touchY;
      this.lastScrollTime = e.timeStamp;

      // Ignore diagonal scrolling
      if (deltaX > Math.abs(deltaY)) return;

      const threshold = 50;
      if (Math.abs(deltaY) > threshold) {
        const direction = deltaY > 0 ? 1 : -1;
        this.navigateSection(direction);
        this.touchStartY = null;
        this.touchStartX = null;
        e.preventDefault();
      }
    }

    private handleTouchEnd(): void {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }

      // Apply momentum scrolling
      const momentum = () => {
        if (Math.abs(this.scrollVelocity) > 0.1) {
          this.scrollVelocity *= 0.95;
          this.rafId = requestAnimationFrame(momentum);
        } else {
          this.scrollVelocity = 0;
          this.rafId = null;
        }
      };

      this.rafId = requestAnimationFrame(momentum);
      this.touchStartY = null;
      this.touchStartX = null;
    }

    private navigateSection(direction: number): void {
      if (this.isScrolling) return;
      
      const nextSection = this.currentSection + direction;
      if (nextSection >= 0 && nextSection < this.sections.length) {
        this.isScrolling = true;
        
        this.sections[nextSection].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        this.currentSection = nextSection;
        
        if (this.scrollTimeout) {
          window.clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = window.setTimeout(() => {
          this.isScrolling = false;
        }, 1000);
        
        this.activateSection(nextSection);
      }
    }

    private setupIntersectionObserver(): void {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const section = entry.target as HTMLElement;
              const index = this.sections.indexOf(section);
              if (index !== -1) {
                this.currentSection = index;
                this.activateSection(index);
              }
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: '-10% 0px'
        }
      );
      
      this.sections.forEach(section => observer.observe(section));
    }

    private activateSection(index: number): void {
      this.sections.forEach((section, i) => {
        section.classList.toggle('section-active', i === index);
        
        // Performance optimization
        if (i === index || i === index + 1 || i === index - 1) {
          section.style.willChange = 'transform, opacity';
        } else {
          section.style.willChange = 'auto';
        }
      });
    }

    private shouldIgnoreScroll(): boolean {
      return document.body.classList.contains('menu-open');
    }

    public destroy(): void {
      window.removeEventListener('wheel', this.handleWheel.bind(this));
      window.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      window.removeEventListener('touchmove', this.handleTouchMove.bind(this));
      window.removeEventListener('touchend', this.handleTouchEnd.bind(this));
      
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
    }
  }

  // Initialize the scroll handler
  new ScrollHandler();
}

export {};