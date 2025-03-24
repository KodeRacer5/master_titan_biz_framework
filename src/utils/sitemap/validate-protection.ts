/**
 * @file validate-protection.ts
 * Validation system for site index protection
 */

import { siteIndexProtection } from './site-index-protection';
import { siteIndex, type PageInfo } from './site-index';
import { NotificationManager } from '../notify/NotificationManager';

class SiteIndexValidator {
  private static instance: SiteIndexValidator;
  private notificationManager: NotificationManager;

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
  }

  static getInstance(): SiteIndexValidator {
    if (!this.instance) {
      this.instance = new SiteIndexValidator();
    }
    return this.instance;
  }

  public validateProtection(): boolean {
    try {
      // 1. Validate core structure protection
      if (!this.validateCoreStructure()) {
        throw new Error('Core structure validation failed');
      }

      // 2. Validate path immutability
      if (!this.validatePathImmutability()) {
        throw new Error('Path immutability validation failed');
      }

      // 3. Validate section locks
      if (!this.validateSectionLocks()) {
        throw new Error('Section locks validation failed');
      }

      // 4. Validate modification permissions
      if (!this.validateModificationPermissions()) {
        throw new Error('Modification permissions validation failed');
      }

      // 5. Validate navigation integrity
      if (!this.validateNavigationIntegrity()) {
        throw new Error('Navigation integrity validation failed');
      }

      this.notificationManager.success('Site index protection validated successfully', {
        title: 'Validation Success',
        duration: 3000
      });

      return true;
    } catch (error) {
      this.notificationManager.error(
        error instanceof Error ? error.message : 'Validation failed',
        { title: 'Validation Error' }
      );
      return false;
    }
  }

  private validateCoreStructure(): boolean {
    const protectedSections = siteIndexProtection.getProtectedSections();
    
    // Check all protected sections exist
    for (const section of protectedSections) {
      const sectionExists = Object.keys(siteIndex).some(key => 
        siteIndex[key as keyof typeof siteIndex].path === section.path
      );
      
      if (!sectionExists) {
        this.notificationManager.error(
          `Protected section "${section.id}" not found in site index`,
          { title: 'Missing Section' }
        );
        return false;
      }
    }

    return true;
  }

  private validatePathImmutability(): boolean {
    const testModification = (obj: any): boolean => {
      if (typeof obj !== 'object' || obj === null) return true;
      
      if (obj.path) {
        try {
          // Attempt to modify path
          const originalPath = obj.path;
          obj.path = '/modified';
          
          // Check if modification was prevented
          const isImmutable = obj.path === originalPath;
          
          // Restore original path (shouldn't be necessary if frozen)
          obj.path = originalPath;
          
          if (!isImmutable) {
            this.notificationManager.error(
              `Path "${originalPath}" is mutable`,
              { title: 'Path Mutability' }
            );
            return false;
          }
        } catch (error) {
          // Error means path is frozen (good)
          return true;
        }
      }
      
      return Object.values(obj).every(value => 
        typeof value === 'object' ? testModification(value) : true
      );
    };

    return testModification(siteIndex);
  }

  private validateSectionLocks(): boolean {
    const protectedSections = siteIndexProtection.getProtectedSections();
    
    for (const section of protectedSections) {
      if (!section.isLocked) continue;
      
      // Try to modify a locked section
      try {
        const sectionData = siteIndex[section.id as keyof typeof siteIndex];
        if (typeof sectionData === 'object' && sectionData !== null) {
          (sectionData as any).title = 'Modified Title';
          
          // If modification succeeded, protection failed
          this.notificationManager.error(
            `Section "${section.id}" is not properly locked`,
            { title: 'Lock Failure' }
          );
          return false;
        }
      } catch (error) {
        // Error means section is frozen (good)
        continue;
      }
    }

    return true;
  }

  private validateModificationPermissions(): boolean {
    const protectedSections = siteIndexProtection.getProtectedSections();
    
    for (const section of protectedSections) {
      // Test allowed modifications
      for (const mod of section.allowedModifications) {
        if (!siteIndexProtection.validateModification(section.path, mod)) {
          this.notificationManager.error(
            `Allowed modification "${mod}" failed for section "${section.id}"`,
            { title: 'Permission Error' }
          );
          return false;
        }
      }
      
      // Test forbidden modification
      const forbiddenMod = 'structure';
      if (siteIndexProtection.validateModification(section.path, forbiddenMod)) {
        this.notificationManager.error(
          `Forbidden modification "${forbiddenMod}" allowed for section "${section.id}"`,
          { title: 'Permission Error' }
        );
        return false;
      }
    }

    return true;
  }

  private validateNavigationIntegrity(): boolean {
    const validatePath = (path: string): boolean => {
      // Check if path is locked when it should be
      const shouldBeLocked = siteIndexProtection.isPathLocked(path);
      const allowedMods = siteIndexProtection.getAllowedModifications(path);
      
      if (shouldBeLocked) {
        // Verify path exists in site index
        const pageInfo = Object.values(siteIndex).find(section => 
          typeof section === 'object' && section !== null && section.path === path
        );
        
        if (!pageInfo) {
          this.notificationManager.error(
            `Locked path "${path}" not found in site index`,
            { title: 'Missing Path' }
          );
          return false;
        }
        
        // Verify modifications are properly restricted
        if (allowedMods.includes('structure')) {
          this.notificationManager.error(
            `Locked path "${path}" allows structural modifications`,
            { title: 'Invalid Permissions' }
          );
          return false;
        }
      }
      
      return true;
    };

    // Validate all paths in site index
    const validateSection = (section: PageInfo): boolean => {
      if (!validatePath(section.path)) return false;
      
      if (section.children) {
        return Object.values(section.children).every(child => validateSection(child));
      }
      
      return true;
    };

    return Object.values(siteIndex).every(section => 
      typeof section === 'object' && section !== null ? validateSection(section as PageInfo) : true
    );
  }
}

// Export singleton instance
export const siteIndexValidator = SiteIndexValidator.getInstance();