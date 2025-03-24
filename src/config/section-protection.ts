import { NotificationManager } from '../utils/notify/NotificationManager';

interface ProtectedSection {
  id: string;
  allowedModifications: string[];
  structure: {
    type: string;
    props: Record<string, any>;
  };
}

class SectionProtection {
  private static instance: SectionProtection;
  private notificationManager: NotificationManager;
  private protectedSections: Map<string, ProtectedSection>;

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
    this.protectedSections = new Map();
    this.initializeProtectedSections();
  }

  static getInstance(): SectionProtection {
    if (!this.instance) {
      this.instance = new SectionProtection();
    }
    return this.instance;
  }

  private initializeProtectedSections() {
    // Lock section 1 structure
    this.protectedSections.set('1', {
      id: 'partnership-section',
      allowedModifications: ['text', 'images'],
      structure: {
        type: 'MainSection',
        props: {
          size: 'lg',
          fullWidth: true,
          id: 'partnership-section',
          allowedEdits: ['text', 'images'],
          'data-protected': 'true',
          'data-section-id': '1'
        }
      }
    });

    // Lock section 2 structure
    this.protectedSections.set('2', {
      id: 'technology-solutions-section',
      allowedModifications: ['text', 'images'],
      structure: {
        type: 'MainSection',
        props: {
          size: 'lg',
          fullWidth: true,
          id: 'technology-solutions-section',
          allowedEdits: ['text', 'images'],
          'data-protected': 'true',
          'data-section-id': '2'
        }
      }
    });

    // Lock section 3 structure
    this.protectedSections.set('3', {
      id: 'patient-acquisition-section',
      allowedModifications: ['text', 'images'],
      structure: {
        type: 'MainSection',
        props: {
          size: 'lg',
          fullWidth: true,
          isLast: true,
          id: 'patient-acquisition-section',
          allowedEdits: ['text', 'images'],
          'data-protected': 'true',
          'data-section-id': '3'
        }
      }
    });
  }

  public validateModification(sectionId: string, modification: string): boolean {
    const section = this.protectedSections.get(sectionId);
    
    if (!section) return true;
    
    const isAllowed = section.allowedModifications.includes(modification);
    
    if (!isAllowed) {
      this.notificationManager.error(
        `Modification "${modification}" is not allowed for protected section "${section.id}"`,
        { title: 'Protected Section' }
      );
    }
    
    return isAllowed;
  }

  public validateStructure(sectionId: string, structure: any): boolean {
    const section = this.protectedSections.get(sectionId);
    
    if (!section) return true;
    
    try {
      // Verify component type
      if (structure.type !== section.structure.type) {
        throw new Error('Component type modification not allowed');
      }
      
      // Verify protected props
      Object.entries(section.structure.props).forEach(([key, value]) => {
        if (structure.props[key] !== value) {
          throw new Error(`Modification of protected prop "${key}" not allowed`);
        }
      });
      
      return true;
    } catch (error) {
      this.notificationManager.error(
        error instanceof Error ? error.message : 'Structure validation failed',
        { title: 'Protected Structure' }
      );
      return false;
    }
  }

  public isProtected(sectionId: string): boolean {
    return this.protectedSections.has(sectionId);
  }

  public getAllowedModifications(sectionId: string): string[] {
    const section = this.protectedSections.get(sectionId);
    return section ? [...section.allowedModifications] : [];
  }
}

export const sectionProtection = SectionProtection.getInstance();