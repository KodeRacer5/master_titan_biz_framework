export interface PageInfo {
  path: string;
  title: string;
  description: string;
  sections?: string[];
  children?: Record<string, PageInfo>;
}

export const siteIndex = {
  // Main Navigation
  home: {
    path: '/',
    title: 'Titan Surgical Systems - Advanced Dental Technology Solutions',
    description: 'Transform your dental practice with cutting-edge technology and precision-first marketing',
    sections: ['hero', 'patient-acquisition', 'precision-workflows', 'competitive-edge', 'partnership-model', 'case-studies']
  },

  // Precision Workflows Section
  precisionWorkflows: {
    path: '/precision-workflows',
    title: 'Precision Workflows',
    description: 'Advanced dental technology solutions for modern practices',
    children: {
      technologyOverview: {
        path: '/digital-scanning/technology-overview',
        title: 'Technology Overview',
        description: 'Advanced scanning technology for precise results'
      },
      caseStudies: {
        path: '/digital-scanning/case-studies',
        title: 'Case Studies',
        description: 'Real-world implementation success stories'
      },
      roiCalculator: {
        path: '/digital-scanning/roi-calculator',
        title: 'ROI Calculator',
        description: 'Calculate your return on investment'
      },
      workflowDemo: {
        path: '/lab-services/workflow-demo',
        title: 'Workflow Demo',
        description: 'See our seamless workflow in action'
      },
      qualityStandards: {
        path: '/lab-services/quality-standards',
        title: 'Quality Standards',
        description: 'Our commitment to excellence'
      },
      partnerNetwork: {
        path: '/lab-services/partner-network',
        title: 'Partner Network',
        description: 'Join our network of trusted partners'
      }
    }
  },

  // Patient Pipeline Section
  patientPipeline: {
    path: '/patient-pipeline',
    title: 'Patient Pipeline',
    description: 'Comprehensive patient acquisition and retention strategies',
    children: {
      acquisition: {
        path: '/marketing-strategy/acquisition',
        title: 'Patient Acquisition',
        description: 'Strategies for attracting high-value patients'
      },
      leadGeneration: {
        path: '/marketing-strategy/lead-generation',
        title: 'Lead Generation',
        description: 'Generate qualified implant patient leads'
      },
      caseAcceptance: {
        path: '/marketing-strategy/case-acceptance',
        title: 'Case Acceptance',
        description: 'Improve treatment plan acceptance rates'
      },
      referrals: {
        path: '/marketing-strategy/referrals',
        title: 'Patient Referrals',
        description: 'Build a sustainable referral network'
      },
      retention: {
        path: '/marketing-strategy/retention',
        title: 'Patient Retention',
        description: 'Maintain long-term patient relationships'
      }
    }
  },

  // Competitive Edge Section
  competitiveEdge: {
    path: '/competitive-edge',
    title: 'Competitive Edge',
    description: 'Stand out in your market with unique advantages',
    children: {
      clearChoice: {
        path: '/insights/clear-choice',
        title: 'Clear Choice',
        description: 'Stand out in your market'
      },
      differentiation: {
        path: '/insights/differentiation',
        title: 'Differentiation',
        description: 'Unique value propositions'
      },
      exclusivity: {
        path: '/insights/exclusivity',
        title: 'Exclusivity',
        description: 'Exclusive partnerships and technologies'
      },
      trends: {
        path: '/insights/trends',
        title: 'Market Trends',
        description: 'Stay ahead of industry developments'
      }
    }
  },

  // Partnership Model Section
  partnershipModel: {
    path: '/partnership-model',
    title: 'Partnership Model',
    description: 'Join our network of successful dental practices',
    children: {
      integration: {
        path: '/partnership-model/integration',
        title: 'Lab Integration',
        description: 'Seamless workflow integration'
      },
      support: {
        path: '/partnership-model/support',
        title: '24/7 Support',
        description: 'Dedicated technical and clinical support'
      },
      training: {
        path: '/partnership-model/training',
        title: 'Training Programs',
        description: 'Comprehensive clinical and business training'
      },
      network: {
        path: '/partnership-model/network',
        title: 'Partner Network',
        description: 'Access exclusive partner benefits'
      },
      benefits: {
        path: '/partnership-model/benefits',
        title: 'Partnership Benefits',
        description: 'Explore our partnership advantages'
      },
      success: {
        path: '/partnership-model/success-stories',
        title: 'Success Stories',
        description: 'Real results from our partners'
      }
    }
  },

  // Lab Services Section
  labServices: {
    path: '/lab-services',
    title: 'Lab Services',
    description: 'Premium dental laboratory services with guaranteed turnaround',
    children: {
      quality: {
        path: '/lab-services/quality',
        title: 'Quality Standards',
        description: 'Our commitment to excellence'
      },
      turnaround: {
        path: '/lab-services/turnaround',
        title: '48hr Turnaround',
        description: 'Guaranteed case delivery'
      },
      technology: {
        path: '/lab-services/technology',
        title: 'Lab Technology',
        description: 'State-of-the-art equipment'
      }
    }
  },

  // Footer Links
  footerLinks: {
    about: {
      path: '/about',
      title: 'About Us',
      description: 'Learn about Titan Surgical Systems'
    },
    careers: {
      path: '/careers',
      title: 'Careers',
      description: 'Join our growing team'
    },
    investorRelations: {
      path: '/investor-relations',
      title: 'Investor Relations',
      description: 'Information for investors'
    },
    contact: {
      path: '/contact',
      title: 'Find Us',
      description: 'Get in touch with our team'
    }
  },

  // Call-to-Action Pages
  ctaPages: {
    scheduleDemo: {
      path: '/schedule-demo',
      title: 'Schedule a Demo',
      description: 'See our technology in action'
    },
    contactSales: {
      path: '/contact-sales',
      title: 'Contact Sales',
      description: 'Speak with our sales team'
    },
    technicalSpecs: {
      path: '/technical-specs',
      title: 'Technical Specifications',
      description: 'Detailed product specifications'
    },
    bookNow: {
      path: '/book-now',
      title: 'Book Now',
      description: 'Schedule your consultation'
    },
    caseStudy: {
      path: '/case-study',
      title: 'Case Study',
      description: 'Read our success stories'
    }
  }
} as const;

export type SiteIndexKey = keyof typeof siteIndex;
export type SiteIndexPath = typeof siteIndex[SiteIndexKey]['path'];

export function getPageInfo(path: string): PageInfo | undefined {
  const allPages = flattenSiteIndex(siteIndex);
  return allPages.find(page => page.path === path);
}

function flattenSiteIndex(index: Record<string, PageInfo>, result: PageInfo[] = []): PageInfo[] {
  Object.values(index).forEach((item: PageInfo) => {
    if (item.path) {
      result.push(item);
    }
    if (item.children) {
      flattenSiteIndex(item.children, result);
    }
  });
  return result;
}

export function getBreadcrumbs(path: string): Array<{ title: string; path: string }> {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [];
  let currentPath = '';

  for (const part of parts) {
    currentPath += `/${part}`;
    const pageInfo = getPageInfo(currentPath);
    if (pageInfo) {
      breadcrumbs.push({
        title: pageInfo.title,
        path: pageInfo.path
      });
    }
  }

  return breadcrumbs;
}

export function getNavigation() {
  return {
    main: [
      siteIndex.precisionWorkflows,
      siteIndex.patientPipeline,
      siteIndex.competitiveEdge,
      siteIndex.partnershipModel
    ],
    footer: Object.values(siteIndex.footerLinks),
    cta: Object.values(siteIndex.ctaPages)
  };
}

export function validateSiteIndex(): boolean {
  const pages = flattenSiteIndex(siteIndex);
  const paths = new Set<string>();
  
  for (const page of pages) {
    // Check for duplicate paths
    if (paths.has(page.path)) {
      console.error(`Duplicate path found: ${page.path}`);
      return false;
    }
    paths.add(page.path);
    
    // Validate required fields
    if (!page.title || !page.description) {
      console.error(`Missing required fields for page: ${page.path}`);
      return false;
    }
    
    // Validate path format
    if (!page.path.startsWith('/')) {
      console.error(`Invalid path format: ${page.path}`);
      return false;
    }
  }
  
  return true;
}