import { RestoreManager } from '../restore/RestoreManager';
import { SectionLock } from '../sections/SectionLock';
import { cacheManager } from '../cache';

interface MonitorConfig {
  interval: number;
  checksumAlgorithm: 'sha3-512' | 'sha256';
  alertThreshold: number;
}

interface MonitorMetrics {
  timestamp: number;
  checksums: Map<string, string>;
  performance: {
    fcp: number;
    lcp: number;
    cls: number;
  };
  integrity: {
    score: number;
    violations: string[];
  };
}

export class MonitorManager {
  private static instance: MonitorManager;
  private config: MonitorConfig;
  private metrics: MonitorMetrics[] = [];
  private intervalId: number | null = null;
  private sectionLock: SectionLock;
  private restoreManager: RestoreManager;

  private constructor(config: MonitorConfig) {
    this.config = config;
    this.sectionLock = SectionLock.getInstance();
    this.restoreManager = RestoreManager.getInstance();
  }

  static getInstance(config?: MonitorConfig): MonitorManager {
    if (!this.instance && config) {
      this.instance = new MonitorManager(config);
    }
    return this.instance;
  }

  async start(): Promise<void> {
    if (this.intervalId) {
      console.warn('Monitor is already running');
      return;
    }

    // Initial check
    await this.checkIntegrity();

    // Start periodic monitoring
    this.intervalId = window.setInterval(async () => {
      await this.checkIntegrity();
    }, this.config.interval);

    // Setup performance monitoring
    this.setupPerformanceMonitoring();
  }

  async stop(): Promise<void> {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async checkIntegrity(): Promise<void> {
    const currentMetrics = await this.gatherMetrics();
    const integrityScore = await this.calculateIntegrityScore(currentMetrics);

    if (integrityScore < this.config.alertThreshold) {
      await this.handleIntegrityViolation(currentMetrics);
    }

    this.metrics.push(currentMetrics);
    await this.persistMetrics(currentMetrics);
  }

  private async gatherMetrics(): Promise<MonitorMetrics> {
    const checksums = new Map<string, string>();
    const violations: string[] = [];

    // Check protected sections
    document.querySelectorAll('[data-section-id]').forEach(section => {
      const id = section.getAttribute('data-section-id');
      if (id && this.sectionLock.isLocked(id)) {
        const checksum = this.generateChecksum(section.innerHTML);
        checksums.set(id, checksum);

        if (!this.sectionLock.validateSection(id, section.innerHTML)) {
          violations.push(`Section integrity violation: ${id}`);
        }
      }
    });

    // Gather performance metrics
    const performanceMetrics = await this.gatherPerformanceMetrics();

    return {
      timestamp: Date.now(),
      checksums,
      performance: performanceMetrics,
      integrity: {
        score: violations.length === 0 ? 1 : 1 - (violations.length / checksums.size),
        violations
      }
    };
  }

  private async calculateIntegrityScore(metrics: MonitorMetrics): Promise<number> {
    const weights = {
      sections: 0.6,
      performance: 0.4
    };

    const sectionScore = metrics.integrity.score;
    const performanceScore = this.calculatePerformanceScore(metrics.performance);

    return (sectionScore * weights.sections) + (performanceScore * weights.performance);
  }

  private calculatePerformanceScore(performance: MonitorMetrics['performance']): number {
    const thresholds = {
      fcp: 2000, // 2 seconds
      lcp: 2500, // 2.5 seconds
      cls: 0.1   // 0.1 threshold
    };

    const scores = {
      fcp: Math.max(0, 1 - (performance.fcp / thresholds.fcp)),
      lcp: Math.max(0, 1 - (performance.lcp / thresholds.lcp)),
      cls: Math.max(0, 1 - (performance.cls / thresholds.cls))
    };

    return (scores.fcp + scores.lcp + scores.cls) / 3;
  }

  private async handleIntegrityViolation(metrics: MonitorMetrics): Promise<void> {
    console.error('Integrity violation detected:', metrics.integrity.violations);

    // Create restore point if needed
    const restorePointId = `integrity_violation_${Date.now()}`;
    await this.restoreManager.createRestorePoint(restorePointId);

    // Notify observers
    this.notifyViolation(metrics);
  }

  private generateChecksum(content: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    if (this.config.checksumAlgorithm === 'sha3-512') {
      // Use SHA3-512 implementation
      return this.sha3(data);
    }
    
    // Fallback to SHA-256
    return this.sha256(data);
  }

  private sha3(data: Uint8Array): string {
    // SHA3-512 implementation
    const hash = crypto.subtle.digest('SHA-512', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private sha256(data: Uint8Array): string {
    const hash = crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async persistMetrics(metrics: MonitorMetrics): Promise<void> {
    await cacheManager.set(`monitor_metrics_${metrics.timestamp}`, metrics);
  }

  private setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.name) {
          case 'FCP':
            this.metrics[this.metrics.length - 1].performance.fcp = entry.startTime;
            break;
          case 'LCP':
            this.metrics[this.metrics.length - 1].performance.lcp = entry.startTime;
            break;
          case 'CLS':
            this.metrics[this.metrics.length - 1].performance.cls = entry.value;
            break;
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-contentful-paint', 'layout-shift'] });
  }

  private notifyViolation(metrics: MonitorMetrics): void {
    // Implement notification logic (e.g., console, analytics, error reporting)
    console.error('Integrity violation detected:', {
      timestamp: new Date(metrics.timestamp).toISOString(),
      score: metrics.integrity.score,
      violations: metrics.integrity.violations,
      performance: metrics.performance
    });
  }
}