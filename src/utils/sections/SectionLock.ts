interface SectionConfig {
  id: string;
  checksum: string;
  isProtected: boolean;
  allowedModifications: Set<string>;
  layoutMetrics?: {
    width: number;
    height: number;
    x: number;
    y: number;
    className: string;
    attributes: Record<string, string>;
  };
}

export class SectionLock {
  private static instance: SectionLock;
  private sections: Map<string, SectionConfig> = new Map();
  private readonly PROTECTED_SELECTORS = ['header', 'footer', '.section-content'];
  private readonly ALLOWED_MODIFICATIONS = ['text', 'images', 'cta-text'];

  private constructor() {
    this.initializeDefaultConfig();
  }

  static getInstance(): SectionLock {
    if (!this.instance) {
      this.instance = new SectionLock();
    }
    return this.instance;
  }

  private initializeDefaultConfig(): void {
    const defaultChecksum = 'a1b2c3d4e5f6';
    
    this.PROTECTED_SELECTORS.forEach(selector => {
      this.sections.set(selector, {
        id: selector,
        checksum: defaultChecksum,
        isProtected: true,
        allowedModifications: new Set(this.ALLOWED_MODIFICATIONS)
      });
    });
  }

  public lockSection(id: string, content: string, options: {
    isProtected: boolean;
    allowedModifications?: string[];
  }): void {
    const element = document.querySelector(`[data-section-id="${id}"]`);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const attributes = Array.from(element.attributes).reduce((acc, attr) => ({
      ...acc,
      [attr.name]: attr.value
    }), {});
    
    const checksum = this.generateChecksum(content);
    this.sections.set(id, {
      id,
      checksum,
      isProtected: options.isProtected,
      allowedModifications: new Set(options.allowedModifications || this.ALLOWED_MODIFICATIONS),
      layoutMetrics: {
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
        className: (element as HTMLElement).className,
        attributes
      }
    });
  }

  public isLocked(id: string): boolean {
    return this.sections.has(id);
  }

  public isModificationAllowed(id: string, modification: string): boolean {
    const section = this.sections.get(id);
    if (!section || !section.isProtected) return true;
    return section.allowedModifications.has(modification);
  }

  public validateSection(id: string, content: string): boolean {
    const section = this.sections.get(id);
    if (!section || !section.isProtected) return true;
    
    const currentChecksum = this.generateChecksum(content);
    return currentChecksum === section.checksum;
  }

  public verifyLayout(id: string): boolean {
    const section = this.sections.get(id);
    if (!section || !section.layoutMetrics) return true;

    const element = document.querySelector(`[data-section-id="${id}"]`);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const metrics = section.layoutMetrics;

    // Verify dimensions within 5% tolerance
    const tolerance = 0.05;
    const dimensionsValid = 
      Math.abs(rect.width - metrics.width) / metrics.width <= tolerance &&
      Math.abs(rect.height - metrics.height) / metrics.height <= tolerance;

    // Verify position allowing for scroll offset
    const scrollOffset = window.scrollY || document.documentElement.scrollTop;
    const positionValid = 
      Math.abs(rect.x - metrics.x) <= 1 && // 1px tolerance for horizontal
      Math.abs((rect.y + scrollOffset) - (metrics.y + scrollOffset)) <= 1; // 1px tolerance for vertical

    // Verify class names (ignoring order)
    const currentClasses = new Set((element as HTMLElement).className.split(' '));
    const originalClasses = new Set(metrics.className.split(' '));
    const classesValid = 
      currentClasses.size === originalClasses.size &&
      Array.from(currentClasses).every(cls => originalClasses.has(cls));

    // Verify critical attributes
    const currentAttributes = Array.from(element.attributes)
      .reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {});
    const attributesValid = Object.entries(metrics.attributes)
      .every(([key, value]) => currentAttributes[key] === value);

    return dimensionsValid && positionValid && classesValid && attributesValid;
  }

  private generateChecksum(content: string): string {
    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) + hash) + content.charCodeAt(i);
      hash = hash >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
  }

  public getProtectedSelectors(): string[] {
    return [...this.PROTECTED_SELECTORS];
  }

  public getAllowedModifications(): string[] {
    return [...this.ALLOWED_MODIFICATIONS];
  }
}