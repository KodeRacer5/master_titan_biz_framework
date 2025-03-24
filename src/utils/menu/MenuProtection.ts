import { navigationItems, type NavigationItem } from '../../config/header-menu';
import { NotificationManager } from '../notify/NotificationManager';

class MenuProtection {
  private static instance: MenuProtection;
  private notificationManager: NotificationManager;
  private readonly ALLOWED_MODIFICATIONS = ['description', 'label'] as const;

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
  }

  static getInstance(): MenuProtection {
    if (!this.instance) {
      this.instance = new MenuProtection();
    }
    return this.instance;
  }

  public validateStructure(items: NavigationItem[]): boolean {
    try {
      // Check structure matches locked navigation
      if (items.length !== navigationItems.length) {
        throw new Error('Navigation structure has been modified');
      }

      // Verify each section matches locked structure
      items.forEach((item, index) => {
        const lockedItem = navigationItems[index];
        
        if (item.label !== lockedItem.label) {
          throw new Error(`Navigation item "${item.label}" does not match locked structure`);
        }

        if (item.sections.length !== lockedItem.sections.length) {
          throw new Error(`Section count mismatch for "${item.label}"`);
        }

        item.sections.forEach((section, sIndex) => {
          const lockedSection = lockedItem.sections[sIndex];
          
          if (section.items.length !== lockedSection.items.length) {
            throw new Error(`Item count mismatch in section "${section.title}"`);
          }

          section.items.forEach((menuItem, iIndex) => {
            const lockedItem = lockedSection.items[iIndex];
            
            if (menuItem.href !== lockedItem.href) {
              throw new Error(`Menu item href has been modified: ${menuItem.href}`);
            }

            if (menuItem.iconRef !== lockedItem.iconRef) {
              throw new Error(`Menu item icon has been modified: ${menuItem.iconRef}`);
            }
          });
        });
      });

      return true;
    } catch (error) {
      this.notificationManager.error(
        error instanceof Error ? error.message : 'Menu structure validation failed',
        { title: 'Menu Protection Error' }
      );
      return false;
    }
  }

  public isModificationAllowed(field: string): boolean {
    return (this.ALLOWED_MODIFICATIONS as readonly string[]).includes(field);
  }

  public validateModification(field: string, value: string): boolean {
    if (!this.isModificationAllowed(field)) {
      this.notificationManager.error(
        `Modification of "${field}" is not allowed`,
        { title: 'Protected Field' }
      );
      return false;
    }

    // Additional validation rules can be added here
    return true;
  }

  public getAllowedModifications(): readonly string[] {
    return this.ALLOWED_MODIFICATIONS;
  }
}

export const menuProtection = MenuProtection.getInstance();