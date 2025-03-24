import { TemplateManager } from './TemplateManager';

export async function createTemplate(config: {
  name: string;
  inherits?: string;
  slots: string[];
  lockStructure: boolean;
}): Promise<void> {
  const manager = TemplateManager.getInstance();
  
  manager.registerTemplate({
    id: config.name.toLowerCase().replace(/\s+/g, '-'),
    name: config.name,
    inherits: config.inherits,
    slots: config.slots.map(slot => ({
      id: slot.toLowerCase().replace(/\s+/g, '-'),
      name: slot,
      isLocked: slot === 'header' || slot === 'footer',
      allowedModifications: slot === 'content-block' ? ['text', 'images', 'markdown'] : []
    })),
    lockStructure: config.lockStructure
  });
}