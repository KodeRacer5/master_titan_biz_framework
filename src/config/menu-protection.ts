import { NotificationManager } from '../utils/notify/NotificationManager';

interface MenuConfig {
  readonly structure: ReadonlyArray<string>;
  readonly allowedModifications: ReadonlyArray<string>;
}

const MENU_CONFIG: MenuConfig = Object.freeze({
  structure: Object.freeze([
    'header',
    'footer',
    'main-nav',
    'mobile-menu'
  ]),
  allowedModifications: Object.freeze([
    'label',
    'description',
    'icon'
  ])
});

class MenuProtection {
  private static instance: MenuProtection;
  private notificationManager: NotificationManager;
  private readonly protectedElements: Set<string>;

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
    this.protectedElements = new Set(MENU_CONFIG.structure);
    Object.freeze(this.protectedElements);
  }

  static getInstance(): MenuProtection {
    if (!this.instance) {
      this.instance = new MenuProtection();
    }
    return this.instance;
  }

  public isProtected(element: string): boolean {
    return this.protectedElements.has(element);
  }

  public validateModification(element: string, modification: string): boolean {
    if (!this.isProtected(element)) return true;
    
    const isAllowed = MENU_CONFIG.allowedModifications.includes(modification);
    
    if (!isAllowed) {
      this.notificationManager.error(
        `Modification "${modification}" is not allowed for protected menu element "${element}"`,
        { title: 'Protected Menu Element' }
      );
    }
    
    return isAllowed;
  }

  public getProtectedElements(): ReadonlyArray<string> {
    return Array.from(this.protectedElements);
  }

  public getAllowedModifications(): ReadonlyArray<string> {
    return MENU_CONFIG.allowedModifications;
  }
}

export const menuProtection = MenuProtection.getInstance();