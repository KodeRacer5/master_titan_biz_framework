import { RestoreManager } from './RestoreManager';

export async function createRestorePoint(id: string): Promise<void> {
  const manager = RestoreManager.getInstance();
  await manager.createRestorePoint(id);
}

export async function restoreFromPoint(id: string): Promise<boolean> {
  const manager = RestoreManager.getInstance();
  return await manager.restoreFromPoint(id);
}