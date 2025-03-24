import { Microscope, FileText, BarChart3, Laptop, ClipboardCheck, HeartHandshake, Target, Users, Handshake, FlaskRound as Flask, Trophy, TrendingUp, Briefcase, MessageSquare, GraduationCap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { siteIndex } from '../utils/sitemap/site-index';

// Types
interface MenuItem {
  readonly label: string;
  readonly href: string;
  readonly iconRef: keyof typeof iconRegistry;
  readonly description: string;
}

interface MenuSection {
  readonly title: string;
  readonly items: readonly MenuItem[];
}

interface NavigationItem {
  readonly label: string;
  readonly sections: readonly MenuSection[];
}

// LOCKED NAVIGATION STRUCTURE
const navigationItems = Object.freeze([
  {
    label: 'Precision Workflows',
    sections: Object.freeze([
      {
        title: 'Digital Solutions',
        items: Object.freeze([
          { 
            label: 'Technology Overview', 
            href: siteIndex.precisionWorkflows.children?.technologyOverview.path,
            iconRef: 'microscope',
            description: 'Advanced scanning technology for precise results'
          },
          { 
            label: 'Case Studies', 
            href: siteIndex.precisionWorkflows.children?.caseStudies.path,
            iconRef: 'fileText',
            description: 'Real-world implementation success stories'
          },
          { 
            label: 'ROI Calculator', 
            href: siteIndex.precisionWorkflows.children?.roiCalculator.path,
            iconRef: 'barChart',
            description: 'Calculate your return on investment'
          }
        ])
      },
      {
        title: 'Lab Integration',
        items: Object.freeze([
          { 
            label: 'Workflow Demo', 
            href: siteIndex.precisionWorkflows.children?.workflowDemo.path,
            iconRef: 'laptop',
            description: 'See our seamless workflow in action'
          },
          { 
            label: 'Quality Standards', 
            href: siteIndex.precisionWorkflows.children?.qualityStandards.path,
            iconRef: 'clipboardCheck',
            description: 'Our commitment to excellence'
          },
          { 
            label: 'Partner Network', 
            href: siteIndex.precisionWorkflows.children?.partnerNetwork.path,
            iconRef: 'heartHandshake',
            description: 'Join our network of trusted partners'
          }
        ])
      }
    ])
  },
  {
    label: 'Patient Acquisition',
    sections: Object.freeze([
      {
        title: 'Marketing',
        items: Object.freeze([
          { 
            label: 'Strategy Overview', 
            href: siteIndex.patientPipeline.children?.acquisition.path,
            iconRef: 'target',
            description: 'Comprehensive marketing solutions'
          },
          { 
            label: 'Lead Generation', 
            href: '/lead-generation',
            iconRef: 'users',
            description: 'Attract high-value patients'
          },
          { 
            label: 'Case Acceptance', 
            href: '/case-acceptance',
            iconRef: 'handshake',
            description: 'Improve treatment acceptance rates'
          }
        ])
      }
    ])
  },
  {
    label: 'Competitive Edge',
    sections: Object.freeze([
      {
        title: 'Market Analysis',
        items: Object.freeze([
          { 
            label: 'Industry Insights', 
            href: siteIndex.competitiveEdge.children?.clearChoice.path,
            iconRef: 'flask',
            description: 'Stay ahead with market intelligence'
          },
          { 
            label: 'Competitive Analysis', 
            href: siteIndex.competitiveEdge.children?.differentiation.path,
            iconRef: 'trophy',
            description: 'Benchmark against competitors'
          },
          { 
            label: 'Market Trends', 
            href: siteIndex.competitiveEdge.children?.trends.path,
            iconRef: 'trendingUp',
            description: 'Latest industry developments'
          }
        ])
      }
    ])
  },
  {
    label: 'Partnership Model',
    sections: Object.freeze([
      {
        title: 'Services',
        items: Object.freeze([
          { 
            label: 'Lab Services', 
            href: siteIndex.partnershipModel.children?.integration.path,
            iconRef: 'briefcase',
            description: 'Comprehensive lab solutions'
          },
          { 
            label: 'Support', 
            href: siteIndex.partnershipModel.children?.support.path,
            iconRef: 'messageSquare',
            description: '24/7 dedicated support'
          },
          { 
            label: 'Training', 
            href: siteIndex.partnershipModel.children?.training.path,
            iconRef: 'graduationCap',
            description: 'Professional development programs'
          }
        ])
      }
    ])
  }
] as const);

// MODIFIABLE ICON REGISTRY
const iconRegistry = {
  microscope: Microscope,
  fileText: FileText,
  barChart: BarChart3,
  laptop: Laptop,
  clipboardCheck: ClipboardCheck,
  heartHandshake: HeartHandshake,
  target: Target,
  users: Users,
  handshake: Handshake,
  flask: Flask,
  trophy: Trophy,
  trendingUp: TrendingUp,
  briefcase: Briefcase,
  messageSquare: MessageSquare,
  graduationCap: GraduationCap
} as const;

// Type-safe helper to get icon component
function getIcon(iconRef: keyof typeof iconRegistry): LucideIcon {
  return iconRegistry[iconRef];
}

// Export frozen navigation with type safety
export type { NavigationItem, MenuSection, MenuItem };
export { navigationItems, getIcon };