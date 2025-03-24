/**
 * Test the site index protection system
 */
import { siteIndexValidator } from './validate-protection';
import { siteIndexProtection } from './site-index-protection';
import { NotificationManager } from '../notify/NotificationManager';

export async function testProtectionSystem(): Promise<boolean> {
  const notificationManager = NotificationManager.getInstance();
  
  try {
    // 1. Validate initial state
    if (!siteIndexValidator.validateProtection()) {
      throw new Error('Initial protection validation failed');
    }

    // 2. Test adding custom section
    const customSection = {
      path: '/custom-section',
      title: 'Custom Section',
      description: 'A custom section'
    };

    const addResult = siteIndexProtection.addCustomSection('precision-workflows', customSection);
    if (!addResult) {
      throw new Error('Failed to add custom section');
    }

    // 3. Verify protection after modification
    if (!siteIndexValidator.validateProtection()) {
      throw new Error('Protection validation failed after modification');
    }

    // 4. Test modification permissions
    const isContentModAllowed = siteIndexProtection.validateModification('/precision-workflows', 'content');
    const isStructureModAllowed = siteIndexProtection.validateModification('/precision-workflows', 'structure');

    if (!isContentModAllowed || isStructureModAllowed) {
      throw new Error('Modification permissions not working correctly');
    }

    notificationManager.success('Protection system tests passed', {
      title: 'Test Success',
      duration: 3000
    });

    return true;
  } catch (error) {
    notificationManager.error(
      error instanceof Error ? error.message : 'Protection system tests failed',
      { title: 'Test Error' }
    );
    return false;
  }
}