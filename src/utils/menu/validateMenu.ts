import { menuProtection } from './MenuProtection';
import { navigationItems } from '../../config/header-menu';
import { NotificationManager } from '../notify/NotificationManager';

export function validateMenu(): boolean {
  const notificationManager = NotificationManager.getInstance();

  try {
    // Validate structure hasn't been modified
    if (!menuProtection.validateStructure(navigationItems)) {
      return false;
    }

    // Verify Object.freeze was applied correctly
    const isFullyFrozen = (obj: any): boolean => {
      if (typeof obj !== 'object' || obj === null) return true;
      
      if (!Object.isFrozen(obj)) {
        throw new Error('Navigation structure is not fully frozen');
      }
      
      return Object.values(obj).every(value => 
        typeof value === 'object' ? isFullyFrozen(value) : true
      );
    };

    if (!isFullyFrozen(navigationItems)) {
      return false;
    }

    notificationManager.success('Menu validation passed', {
      title: 'Menu Protection',
      duration: 3000
    });

    return true;
  } catch (error) {
    notificationManager.error(
      error instanceof Error ? error.message : 'Menu validation failed',
      { title: 'Validation Error' }
    );
    return false;
  }
}