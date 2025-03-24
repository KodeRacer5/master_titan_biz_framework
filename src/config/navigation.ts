import { siteIndex } from '../utils/sitemap/site-index';
import { Microscope, FileText, Calculator, Laptop, ClipboardCheck, HeartHandshake, Target, Users, Trophy, TrendingUp, Briefcase, MessageSquare, GraduationCap, Network } from 'lucide-react';

export const navigationConfig = {
  main: [
    {
      label: 'Precision Workflows',
      sections: [
        {
          title: 'Digital Solutions',
          items: [
            {
              label: 'Technology Overview',
              href: siteIndex.precisionWorkflows.children?.technologyOverview.path,
              icon: Microscope,
              description: 'Advanced scanning technology for precise results'
            },
            {
              label: 'Case Studies',
              href: siteIndex.precisionWorkflows.children?.caseStudies.path,
              icon: FileText,
              description: 'Real-world implementation success stories'
            },
            {
              label: 'ROI Calculator',
              href: siteIndex.precisionWorkflows.children?.roiCalculator.path,
              icon: Calculator,
              description: 'Calculate your return on investment'
            }
          ]
        },
        {
          title: 'Lab Integration',
          items: [
            {
              label: 'Workflow Demo',
              href: siteIndex.precisionWorkflows.children?.workflowDemo.path,
              icon: Laptop,
              description: 'See our seamless workflow in action'
            },
            {
              label: 'Quality Standards',
              href: siteIndex.precisionWorkflows.children?.qualityStandards.path,
              icon: ClipboardCheck,
              description: 'Our commitment to excellence'
            },
            {
              label: 'Partner Network',
              href: siteIndex.precisionWorkflows.children?.partnerNetwork.path,
              icon: HeartHandshake,
              description: 'Join our network of trusted partners'
            }
          ]
        }
      ]
    },
    {
      label: 'Patient Acquisition',
      sections: [
        {
          title: 'Marketing Solutions',
          items: [
            {
              label: 'Strategy Overview',
              href: siteIndex.patientPipeline.children?.acquisition.path,
              icon: Target,
              description: 'Comprehensive marketing solutions'
            },
            {
              label: 'Lead Generation',
              href: '/lead-generation',
              icon: Users,
              description: 'Attract high-value patients'
            },
            {
              label: 'Case Acceptance',
              href: '/case-acceptance',
              icon: Trophy,
              description: 'Improve treatment acceptance rates'
            }
          ]
        }
      ]
    },
    {
      label: 'Competitive Edge',
      sections: [
        {
          title: 'Market Analysis',
          items: [
            {
              label: 'Industry Insights',
              href: siteIndex.competitiveEdge.children?.clearChoice.path,
              icon: Trophy,
              description: 'Stay ahead with market intelligence'
            },
            {
              label: 'Competitive Analysis',
              href: siteIndex.competitiveEdge.children?.differentiation.path,
              icon: TrendingUp,
              description: 'Benchmark against competitors'
            },
            {
              label: 'Market Trends',
              href: siteIndex.competitiveEdge.children?.trends.path,
              icon: TrendingUp,
              description: 'Latest industry developments'
            }
          ]
        }
      ]
    },
    {
      label: 'Partnership Model',
      sections: [
        {
          title: 'Services',
          items: [
            {
              label: 'Lab Services',
              href: siteIndex.partnershipModel.children?.integration.path,
              icon: Briefcase,
              description: 'Comprehensive lab solutions'
            },
            {
              label: 'Support',
              href: siteIndex.partnershipModel.children?.support.path,
              icon: MessageSquare,
              description: '24/7 dedicated support'
            },
            {
              label: 'Training',
              href: siteIndex.partnershipModel.children?.training.path,
              icon: GraduationCap,
              description: 'Professional development programs'
            },
            {
              label: 'Network',
              href: siteIndex.partnershipModel.children?.network.path,
              icon: Network,
              description: 'Join our partner network'
            }
          ]
        }
      ]
    }
  ],
  cta: [
    {
      label: 'Schedule Demo',
      href: siteIndex.ctaPages.scheduleDemo.path
    },
    {
      label: 'Technical Specs',
      href: siteIndex.ctaPages.technicalSpecs.path
    }
  ]
} as const;

export type NavigationConfig = typeof navigationConfig;