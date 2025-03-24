import { SectionLock } from '../sections/SectionLock';

interface LayoutMetrics {
  position: DOMRect;
  styles: CSSStyleDeclaration;
  children: number;
  className: string;
}

export class LayoutVerifier {
  private static instance: LayoutVerifier;
  private originalLayouts: Map<string, LayoutMetrics> = new Map();
  private threshold: number = 0.98;
  private sectionLock: SectionLock;

  private constructor() {
    this.sectionLock = SectionLock.getInstance();
  }

  static getInstance(): LayoutVerifier {
    if (!this.instance) {
      this.instance = new LayoutVerifier();
    }
    return this.instance;
  }

  public captureLayout(element: Element): LayoutMetrics {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    
    return {
      position: rect,
      styles: styles,
      children: element.children.length,
      className: (element as HTMLElement).className
    };
  }

  public compareLayouts(original: LayoutMetrics, current: LayoutMetrics): number {
    let score = 0;
    const weights = {
      position: 0.4,
      styles: 0.3,
      structure: 0.3
    };

    // Position comparison
    const positionScore = this.comparePositions(original.position, current.position);
    score += positionScore * weights.position;

    // Styles comparison
    const stylesScore = this.compareStyles(original.styles, current.styles);
    score += stylesScore * weights.styles;

    // Structure comparison
    const structureScore = this.compareStructure(original, current);
    score += structureScore * weights.structure;

    return score;
  }

  private comparePositions(original: DOMRect, current: DOMRect): number {
    const dimensionScore = 1 - Math.abs(
      (original.width * original.height - current.width * current.height) /
      (original.width * original.height)
    );

    const positionScore = 1 - (
      Math.abs(original.x - current.x) + Math.abs(original.y - current.y)
    ) / (window.innerWidth + window.innerHeight);

    return (dimensionScore + positionScore) / 2;
  }

  private compareStyles(original: CSSStyleDeclaration, current: CSSStyleDeclaration): number {
    const criticalProperties = [
      'display', 'position', 'flexDirection', 'justifyContent', 'alignItems',
      'margin', 'padding', 'transform', 'transition'
    ];

    let matches = 0;
    criticalProperties.forEach(prop => {
      if (original[prop as any] === current[prop as any]) matches++;
    });

    return matches / criticalProperties.length;
  }

  private compareStructure(original: LayoutMetrics, current: LayoutMetrics): number {
    const childrenScore = 1 - Math.abs(original.children - current.children) / Math.max(original.children, 1);
    const classScore = this.compareClassNames(original.className, current.className);
    return (childrenScore + classScore) / 2;
  }

  private compareClassNames(original: string, current: string): number {
    const originalClasses = new Set(original.split(' '));
    const currentClasses = new Set(current.split(' '));
    
    let matches = 0;
    originalClasses.forEach(cls => {
      if (currentClasses.has(cls)) matches++;
    });

    return matches / Math.max(originalClasses.size, currentClasses.size);
  }

  public verifyLayout(): boolean {
    let totalScore = 0;
    let elementsChecked = 0;

    document.querySelectorAll('[data-section-id]').forEach(section => {
      const id = section.getAttribute('data-section-id');
      if (!id) return;

      const originalMetrics = this.originalLayouts.get(id);
      if (!originalMetrics) {
        this.originalLayouts.set(id, this.captureLayout(section));
        return;
      }

      const currentMetrics = this.captureLayout(section);
      const score = this.compareLayouts(originalMetrics, currentMetrics);
      
      totalScore += score;
      elementsChecked++;

      if (score < this.threshold) {
        console.warn(`Layout verification failed for section ${id}. Score: ${score.toFixed(3)}`);
      }
    });

    const averageScore = totalScore / elementsChecked;
    return averageScore >= this.threshold;
  }

  public freezeCurrentLayout(): void {
    document.querySelectorAll('[data-section-id]').forEach(section => {
      const id = section.getAttribute('data-section-id');
      if (id) {
        this.originalLayouts.set(id, this.captureLayout(section));
        this.sectionLock.lockSection(id, section.innerHTML, {
          isProtected: true,
          allowedModifications: this.sectionLock.getAllowedModifications()
        });
      }
    });
  }
}