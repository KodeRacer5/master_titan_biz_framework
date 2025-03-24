/**
 * @file site-index-protection.ts
 * Site Index Protection System for Titan Surgical Systems
 */

import { siteIndex, type PageInfo } from './site-index';
import { NotificationManager } from '../notify/NotificationManager';

interface ProtectedSection {
  readonly id: string;
  readonly path: string;
  readonly isLocked: boolean;
  readonly allowedModifications: string[];
}

class SiteIndexProtection {
  private static instance: SiteIndexProtection;
  private notificationManager: NotificationManager;
  private readonly protectedSections: ReadonlyArray<ProtectedSection>;
  private readonly LOCKED_SECTIONS = Object.freeze([
    'precision-workflows',
    'patient-pipeline',
    'competitive-edge',
    'partnership-model'
  ]);

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
    this.protectedSections = this.initializeProtectedSections();
    this.freezeStructure();
  }

  static getInstance(): SiteIndexProtection {
    if (!this.instance) {
      this.instance = new SiteIndexProtection();
    }
    return this.instance;
  }

  private initializeProtectedSections(): ReadonlyArray<ProtectedSection> {
    return Object.freeze(
      this.LOCKED_SECTIONS.map(id => ({
        id,
        path: `/${id}`,
        isLocked: true,
        allowedModifications: ['content', 'metadata']
      }))
    );
  }

  private freezeStructure(): void {
    // Freeze main navigation structure
    Object.keys(siteIndex).forEach(key => {
      if (this.LOCKED_SECTIONS.includes(key)) {
        Object.freeze(siteIndex[key as keyof typeof siteIndex]);
      }
    });

    // Freeze paths
    Object.values(siteIndex).forEach(section => {
      if (typeof section === 'object' && section !== null) {
        Object.freeze(section.path);
      }
    });
  }

  public validateModification(path: string, modification: string): boolean {
    const section = this.protectedSections.find(s => path.startsWith(s.path));
    
    if (!section) return true;
    if (!section.isLocked) return true;
    
    const isAllowed = section.allowedModifications.includes(modification);
    
    if (!isAllowed) {
      this.notificationManager.error(
        `Modification "${modification}" is not allowed for section "${section.id}"`,
        {
          title: 'Protected Section',
          duration: 5000
        }
      );
    }
    
    return isAllowed;
  }

  public validateStructure(): boolean {
    try {
      // Verify main sections exist and are locked
      this.LOCKED_SECTIONS.forEach(sectionId => {
        const section = siteIndex[sectionId as keyof typeof siteIndex];
        if (!section) {
          throw new Error(`Required section "${sectionId}" is missing`);
        }
        if (!Object.isFrozen(section)) {
          throw new Error(`Section "${sectionId}" must be frozen`);
        }
      });

      // Verify paths are frozen
      Object.values(siteIndex).forEach(section => {
        if (typeof section === 'object' && section !== null) {
          if (!Object.isFrozen(section.path)) {
            throw new Error(`Path for section must be frozen`);
          }
        }
      });

      return true;
    } catch (error) {
      this.notificationManager.error(
        error instanceof Error ? error.message : 'Structure validation failed',
        {
          title: 'Validation Error',
          duration: 5000
        }
      );
      return false;
    }
  }

  public addCustomSection(parentId: string, newSection: PageInfo): boolean {
    const parent = this.protectedSections.find(s => s.id === parentId);
    
    if (!parent) {
      this.notificationManager.error(
        `Parent section "${parentId}" not found`,
        { title: 'Invalid Parent' }
      );
      return false;
    }
    
    if (parent.isLocked && !this.validateModification(parent.path, 'content')) {
      return false;
    }
    
    try {
      // Add to site index without modifying core structure
      const customSections = (siteIndex as any).customSections || {};
      customSections[parentId] = customSections[parentId] || {};
      customSections[parentId][newSection.path] = newSection;
      
      this.notificationManager.success(
        `Added custom section to "${parentId}"`,
        { title: 'Section Added' }
      );
      
      return true;
    } catch (error) {
      this.notificationManager.error(
        'Failed to add custom section',
        { title: 'Add Section Error' }
      );
      return false;
    }
  }

  public getProtectedSections(): ReadonlyArray<ProtectedSection> {
    return this.protectedSections;
  }

  public isPathLocked(path: string): boolean {
    return this.protectedSections.some(
      section => section.isLocked && path.startsWith(section.path)
    );
  }

  public getAllowedModifications(path: string): string[] {
    const section = this.protectedSections.find(s => path.startsWith(s.path));
    return section ? [...section.allowedModifications] : [];
  }
}

// Export singleton instance
export const siteIndexProtection = SiteIndexProtection.getInstance();

// Export types
export type { ProtectedSection };