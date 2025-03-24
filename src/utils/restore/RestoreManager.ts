import { cacheManager } from '../cache';
import { SectionLock } from '../sections/SectionLock';

interface RestorePoint {
  id: string;
  timestamp: number;
  files: Map<string, string>;
  checksum: string;
  metadata: {
    version: string;
    layout: {
      sections: string[];
      hierarchy: string;
    };
    content: Record<string, any>;
  };
}

export class RestoreManager {
  private static instance: RestoreManager;
  private sectionLock: SectionLock;
  private restorePoints: Map<string, RestorePoint> = new Map();
  private readonly MAX_RESTORE_POINTS = 5;

  private constructor() {
    this.sectionLock = SectionLock.getInstance();
  }

  static getInstance(): RestoreManager {
    if (!this.instance) {
      this.instance = new RestoreManager();
    }
    return this.instance;
  }

  async createRestorePoint(id: string): Promise<void> {
    const timestamp = Date.now();
    const files = new Map<string, string>();
    const protectedSections = this.sectionLock.getProtectedSelectors();

    // Capture current state
    document.querySelectorAll('[data-section-id]').forEach(section => {
      const sectionId = section.getAttribute('data-section-id');
      if (sectionId && protectedSections.includes(sectionId)) {
        files.set(sectionId, section.innerHTML);
      }
    });

    // Generate checksum
    const checksum = await this.generateChecksum(files);

    // Create restore point
    const restorePoint: RestorePoint = {
      id,
      timestamp,
      files,
      checksum,
      metadata: {
        version: '1.0',
        layout: {
          sections: Array.from(files.keys()),
          hierarchy: document.querySelector('main')?.innerHTML || ''
        },
        content: this.captureContentState()
      }
    };

    // Store restore point
    this.restorePoints.set(id, restorePoint);
    await this.pruneOldRestorePoints();
    await this.persistRestorePoint(restorePoint);
  }

  async restoreFromPoint(id: string): Promise<boolean> {
    const restorePoint = this.restorePoints.get(id);
    if (!restorePoint) {
      console.error(`Restore point ${id} not found`);
      return false;
    }

    // Verify checksums
    const currentChecksum = await this.generateChecksum(restorePoint.files);
    if (currentChecksum !== restorePoint.checksum) {
      console.error('Checksum verification failed');
      return false;
    }

    try {
      // Restore protected sections
      restorePoint.files.forEach((content, sectionId) => {
        const section = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (section) {
          section.innerHTML = content;
        }
      });

      // Restore layout hierarchy
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = restorePoint.metadata.layout.hierarchy;
      }

      // Restore content state
      this.restoreContentState(restorePoint.metadata.content);

      // Clear cache
      await cacheManager.clear();

      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }

  private async pruneOldRestorePoints(): Promise<void> {
    if (this.restorePoints.size > this.MAX_RESTORE_POINTS) {
      const sortedPoints = Array.from(this.restorePoints.entries())
        .sort(([, a], [, b]) => b.timestamp - a.timestamp);

      // Keep only the most recent points
      const pointsToRemove = sortedPoints.slice(this.MAX_RESTORE_POINTS);
      pointsToRemove.forEach(([id]) => {
        this.restorePoints.delete(id);
        cacheManager.clear(`restore_point_${id}`);
      });
    }
  }

  private async persistRestorePoint(point: RestorePoint): Promise<void> {
    await cacheManager.set(`restore_point_${point.id}`, point);
  }

  private async generateChecksum(files: Map<string, string>): Promise<string> {
    const content = Array.from(files.values()).join('');
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private captureContentState(): Record<string, any> {
    return {
      sections: Array.from(document.querySelectorAll('[data-section-id]')).map(section => ({
        id: section.getAttribute('data-section-id'),
        content: section.innerHTML,
        attributes: Array.from(section.attributes).reduce((acc, attr) => ({
          ...acc,
          [attr.name]: attr.value
        }), {})
      }))
    };
  }

  private restoreContentState(state: Record<string, any>): void {
    state.sections.forEach((sectionData: any) => {
      const section = document.querySelector(`[data-section-id="${sectionData.id}"]`);
      if (section) {
        Object.entries(sectionData.attributes).forEach(([name, value]) => {
          section.setAttribute(name, value as string);
        });
      }
    });
  }
}