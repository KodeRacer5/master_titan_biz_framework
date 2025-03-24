import { MonitorManager } from './MonitorManager';

export async function startMonitoring(config: {
  interval: number;
  checksumAlgorithm: 'sha3-512' | 'sha256';
  alertThreshold: number;
}): Promise<void> {
  const monitor = MonitorManager.getInstance(config);
  await monitor.start();
}

export async function stopMonitoring(): Promise<void> {
  const monitor = MonitorManager.getInstance();
  await monitor.stop();
}