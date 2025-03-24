import { cacheManager } from '../cache';
import { NotificationManager } from '../notify/NotificationManager';

export async function clearCache(): Promise<void> {
  const notificationManager = NotificationManager.getInstance();
  
  try {
    // Clear application cache
    await cacheManager.clearAll();
    
    // Clear browser caches if available
    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map(key => caches.delete(key))
      );
    }

    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();

    // Notify success
    notificationManager.success('Cache cleared successfully', {
      title: 'Cache Cleared',
      duration: 3000
    });

    // Reload the page to ensure fresh state
    window.location.reload();
  } catch (error) {
    console.error('Failed to clear cache:', error);
    notificationManager.error('Failed to clear cache', {
      title: 'Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    throw error;
  }
}