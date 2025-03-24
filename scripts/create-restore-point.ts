import { RestoreManager } from '../src/utils/restore/RestoreManager';
import { NotificationManager } from '../src/utils/notify/NotificationManager';

async function createRestorePoint() {
  const restoreManager = RestoreManager.getInstance();
  const notificationManager = NotificationManager.getInstance();
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const restorePointId = `site-backup-${timestamp}`;
    
    console.log('\nCreating Restore Point\n' + '='.repeat(30));
    console.log(`Restore Point ID: ${restorePointId}`);
    
    await restoreManager.createRestorePoint(restorePointId);
    
    notificationManager.success('Restore point created successfully', {
      title: 'Backup Created',
      duration: 5000
    });
    
    console.log('\nRestore point created successfully!');
    console.log(`Use this ID to restore: ${restorePointId}`);
  } catch (error) {
    console.error('Failed to create restore point:', error);
    notificationManager.error('Failed to create restore point', {
      title: 'Backup Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    process.exit(1);
  }
}

createRestorePoint().catch(console.error);