import { clearCache } from './clearCache';
import { NotificationManager } from '../notify/NotificationManager';

export async function executeCacheClear(): Promise<void> {
  const notificationManager = NotificationManager.getInstance();
  
  try {
    notificationManager.info('Clearing cache...', {
      title: 'Cache Clear',
      duration: 2000
    });
    
    await clearCache();
  } catch (error) {
    console.error('Cache clear command failed:', error);
  }
}