import { NotificationManager } from '../utils/notify/NotificationManager';

// Types
interface PageInfo {
  readonly path: string;
  readonly title: string;
  readonly mainSections?: readonly string[];
  readonly subSections?: readonly string[];
}

interface FooterLink {
  readonly title: string;
  readonly path: string;
}

// SITE INDEX - LOCKED STRUCTURE
const SITE_INDEX = Object.freeze({
  home: Object.freeze({
    path: '/',
    title: 'Titan Surgical Systems',
    mainSections: Object.freeze([
      'precision-workflows',
      'patient-pipeline', 
      'competitive-edge',
      'partnership-model'
    ])
  }),

  mainNavigation: Object.freeze({
    'precision-workflows': Object.freeze({
      path: '/precision-workflows',
      title: 'Precision Workflows',
      subSections: Object.freeze([
        'technology-overview',
        'case-studies',
        'roi-calculator',
        'workflow-demo',
        'quality-standards',
        'partner-network'
      ])
    }),

    'patient-pipeline': Object.freeze({
      path: '/patient-pipeline',
      title: 'Patient Pipeline',
      subSections: Object.freeze([
        'acquisition',
        'conversion',
        'referrals',
        'retention'
      ])
    }),

    'competitive-edge': Object.freeze({
      path: '/competitive-edge',
      title: 'Competitive Edge',
      subSections: Object.freeze([
        'clear-choice',
        'differentiation',
        'exclusivity',
        'trends'
      ])
    }),

    'partnership-model': Object.freeze({
      path: '/partnership-model',
      title: 'Partnership Model',
      subSections: Object.freeze([
        'integration',
        'support',
        'training',
        'network'
      ])
    })
  }),

  footerLinks: Object.freeze({
    corporateLinks: Object.freeze([
      { title: 'About', path: '/about' },
      { title: 'Careers', path: '/careers' },
      { title: 'Investor Relations', path: '/investor-relations' },
      { title: 'Find Us', path: '/contact' }
    ] as const),

    callToActions: Object.freeze([
      { title: 'Schedule Demo', path: '/schedule-demo' },
      { title: 'Contact Sales', path: '/contact-sales' },
      { title: 'View Technical Specs', path: '/technical-specs' },
      { title: 'Book Now', path: '/book-now' }
    ] as const)
  })
});

// Safe section addition function
function addNewSection(
  parentSection: keyof typeof SITE_INDEX.mainNavigation,
  newSectionKey: string,
  newSectionData: PageInfo
): typeof SITE_INDEX | null {
  const notificationManager = NotificationManager.getInstance();

  try {
    // Validate parent section exists
    if (!SITE_INDEX.mainNavigation[parentSection]) {
      throw new Error(`Parent section "${parentSection}" does not exist`);
    }

    // Validate new section key format
    if (!/^[a-z0-9-]+$/.test(newSectionKey)) {
      throw new Error('Section key must be lowercase alphanumeric with hyphens only');
    }

    // Validate required fields
    if (!newSectionData.path || !newSectionData.title) {
      throw new Error('New section must have path and title');
    }

    // Create new section safely
    const parent = SITE_INDEX.mainNavigation[parentSection];
    const updatedSubSections = [...parent.subSections, newSectionKey];

    // Return new frozen structure
    return Object.freeze({
      ...SITE_INDEX,
      mainNavigation: Object.freeze({
        ...SITE_INDEX.mainNavigation,
        [parentSection]: Object.freeze({
          ...parent,
          subSections: Object.freeze(updatedSubSections)
        })
      })
    });
  } catch (error) {
    notificationManager.error(
      error instanceof Error ? error.message : 'Failed to add new section',
      { title: 'Section Addition Error' }
    );
    return null;
  }
}

// Type exports
export type SiteIndexKey = keyof typeof SITE_INDEX;
export type MainNavigationKey = keyof typeof SITE_INDEX.mainNavigation;
export type FooterLinkType = typeof SITE_INDEX.footerLinks.corporateLinks[number];
export type CTALinkType = typeof SITE_INDEX.footerLinks.callToActions[number];

// Validation function
function validateSiteIndex(): boolean {
  const notificationManager = NotificationManager.getInstance();

  try {
    // Check structure is frozen
    if (!Object.isFrozen(SITE_INDEX)) {
      throw new Error('Site index is not frozen');
    }

    // Check main sections
    SITE_INDEX.home.mainSections.forEach(section => {
      if (!SITE_INDEX.mainNavigation[section as MainNavigationKey]) {
        throw new Error(`Main section "${section}" not found in navigation`);
      }
    });

    // Check navigation structure
    Object.entries(SITE_INDEX.mainNavigation).forEach(([key, section]) => {
      if (!Object.isFrozen(section)) {
        throw new Error(`Navigation section "${key}" is not frozen`);
      }
      if (!Object.isFrozen(section.subSections)) {
        throw new Error(`Subsections for "${key}" are not frozen`);
      }
    });

    // Check footer links
    if (!Object.isFrozen(SITE_INDEX.footerLinks.corporateLinks)) {
      throw new Error('Corporate links are not frozen');
    }
    if (!Object.isFrozen(SITE_INDEX.footerLinks.callToActions)) {
      throw new Error('Call to action links are not frozen');
    }

    return true;
  } catch (error) {
    notificationManager.error(
      error instanceof Error ? error.message : 'Site index validation failed',
      { title: 'Validation Error' }
    );
    return false;
  }
}

// Exports
export { SITE_INDEX, addNewSection, validateSiteIndex };