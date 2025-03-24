import { SectionLock } from '../sections/SectionLock';
import { NotificationManager } from '../notify/NotificationManager';

interface TemplateSlot {
  id: string;
  name: string;
  isLocked: boolean;
  allowedModifications?: string[];
}

interface TemplateConfig {
  id: string;
  name: string;
  inherits?: string;
  slots: TemplateSlot[];
  lockStructure: boolean;
}

export class TemplateManager {
  private static instance: TemplateManager;
  private templates: Map<string, TemplateConfig> = new Map();
  private sectionLock: SectionLock;
  private notificationManager: NotificationManager;

  private constructor() {
    this.sectionLock = SectionLock.getInstance();
    this.notificationManager = NotificationManager.getInstance();
    this.initializeDefaultTemplates();
  }

  static getInstance(): TemplateManager {
    if (!this.instance) {
      this.instance = new TemplateManager();
    }
    return this.instance;
  }

  private initializeDefaultTemplates(): void {
    this.registerTemplate({
      id: 'base-layout',
      name: 'Base Layout',
      slots: [
        { id: 'header', name: 'Header', isLocked: true },
        { id: 'content', name: 'Content', isLocked: false },
        { id: 'footer', name: 'Footer', isLocked: true }
      ],
      lockStructure: true
    });

    this.registerTemplate({
      id: 'master-page',
      name: 'Master Page',
      inherits: 'base-layout',
      slots: [
        { id: 'header', name: 'Header', isLocked: true },
        { 
          id: 'content-block', 
          name: 'Content Block', 
          isLocked: false, 
          allowedModifications: ['text', 'images', 'markdown'] 
        },
        { id: 'footer', name: 'Footer', isLocked: true }
      ],
      lockStructure: true
    });
  }

  public registerTemplate(config: TemplateConfig): void {
    // Validate inheritance
    if (config.inherits) {
      const parentTemplate = this.templates.get(config.inherits);
      if (!parentTemplate) {
        throw new Error(`Parent template "${config.inherits}" not found`);
      }
    }

    this.templates.set(config.id, config);

    if (config.lockStructure) {
      this.lockTemplateStructure(config);
    }

    this.notificationManager.success(`Template "${config.name}" registered successfully`, {
      title: 'Template Registration',
      duration: 3000
    });
  }

  private lockTemplateStructure(template: TemplateConfig): void {
    template.slots.forEach(slot => {
      if (slot.isLocked) {
        this.sectionLock.lockSection(
          `template-${template.id}-${slot.id}`,
          '',
          {
            isProtected: true,
            allowedModifications: slot.allowedModifications || []
          }
        );
      }
    });
  }

  public getTemplate(id: string): TemplateConfig | undefined {
    const template = this.templates.get(id);
    
    if (template?.inherits) {
      const parentTemplate = this.getTemplate(template.inherits);
      if (parentTemplate) {
        return {
          ...parentTemplate,
          ...template,
          slots: [...parentTemplate.slots, ...template.slots]
        };
      }
    }
    
    return template;
  }

  public validateTemplate(id: string, content: string): boolean {
    const template = this.templates.get(id);
    if (!template) return false;

    return template.slots.every(slot => {
      if (!slot.isLocked) return true;
      return this.sectionLock.validateSection(
        `template-${template.id}-${slot.id}`,
        content
      );
    });
  }

  public getSlotConfig(templateId: string, slotId: string): TemplateSlot | undefined {
    const template = this.getTemplate(templateId);
    return template?.slots.find(slot => slot.id === slotId);
  }

  public isSlotLocked(templateId: string, slotId: string): boolean {
    const slot = this.getSlotConfig(templateId, slotId);
    return slot?.isLocked || false;
  }

  public getAllowedModifications(templateId: string, slotId: string): string[] {
    const slot = this.getSlotConfig(templateId, slotId);
    return slot?.allowedModifications || [];
  }
}