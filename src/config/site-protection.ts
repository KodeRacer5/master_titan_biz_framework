import { NotificationManager } from '../utils/notify/NotificationManager';

interface ProtectionConfig {
  readonly sections: ReadonlyArray<string>;
  readonly allowedModifications: ReadonlyArray<string>;
}

const PROTECTION_CONFIG: ProtectionConfig = Object.freeze({
  sections: Object.freeze([
    'precision-workflows',
    'patient-pipeline',
    'competitive-edge',
    'partnership-model'
  ]),
  allowedModifications: Object.freeze([
    'content',
    'metadata',
    'description'
  ])
});

class SiteProtection {
  private static instance: SiteProtection;
  private notificationManager: NotificationManager;
  private readonly protectedSections: Set<string>;

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
    this.protectedSections = new Set(PROTECTION_CONFIG.sections);
    Object.freeze(this.protectedSections);
  }

  static getInstance(): SiteProtection {
    if (!this.instance) {
      this.instance = new SiteProtection();
    }
    return this.instance;
  }

  public isProtected(section: string): boolean {
    return this.protectedSections.has(section);
  }

  public validateModification(section: string, modification: string): boolean {
    if (!this.isProtected(section)) return true;
    
    const isAllowed = PROTECTION_CONFIG.allowedModifications.includes(modification);
    
    if (!isAllowed) {
      this.notificationManager.error(
        `Modification "${modification}" is not allowed for protected section "${section}"`,
        { title: 'Protected Section' }
      );
    }
    
    return isAllowed;
  }

  public getProtectedSections(): ReadonlyArray<string> {
    return Array.from(this.protectedSections);
  }

  public getAllowedModifications(): ReadonlyArray<string> {
    return PROTECTION_CONFIG.allowedModifications;
  }
}

export const siteProtection = SiteProtection.getInstance();