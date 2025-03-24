import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const footerSections = [
  {
    title: 'Titan Surgical Systems',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Investor Relations', href: '/investors' },
      { label: 'Find Us', href: '/locations' }
    ]
  },
  {
    title: 'Growth Systems',
    links: [
      { label: 'Value Cases', href: '/value-cases' },
      { label: 'Practice ROI', href: '/practice-roi' },
      { label: 'Case Volume', href: '/case-volume' },
      { label: 'Revenue Streams', href: '/revenue-streams' }
    ]
  },
  {
    title: 'Patient Pipeline',
    links: [
      { label: 'Acquisition', href: '/acquisition' },
      { label: 'Conversion', href: '/conversion' },
      { label: 'Referrals', href: '/referrals' },
      { label: 'Retention', href: '/retention' }
    ]
  },
  {
    title: 'Marketing Advantage',
    links: [
      { label: 'Clear Choice', href: '/clear-choice' },
      { label: 'Differentiation', href: '/differentiation' },
      { label: 'Exclusivity', href: '/exclusivity' },
      { label: 'Trends', href: '/trends' }
    ]
  },
  {
    title: 'Elite Partnership',
    links: [
      { label: 'Integration', href: '/integration' },
      { label: 'Support', href: '/support' },
      { label: 'Training', href: '/training' },
      { label: 'Network', href: '/network' }
    ]
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className={cn(
        "relative bg-white w-full z-10",
        "border-t border-gray-200",
        "py-12 lg:py-16",
        "transform-gpu perspective-1000"
      )}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12">
          {footerSections.map((section, index) => (
            <div 
              key={section.title} 
              className={cn(
                "flex flex-col",
                "transform-gpu transition-all duration-500 ease-out",
                "hover:translate-z-12 hover:scale-[1.02]",
                "group"
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <h3 className={cn(
                "text-sm font-semibold text-gray-900 mb-3",
                "relative",
                "after:content-[''] after:absolute after:bottom-0 after:left-0",
                "after:w-0 after:h-0.5 after:bg-blue-500",
                "after:transition-all after:duration-300",
                "group-hover:after:w-full"
              )}>
                {section.title}
              </h3>
              <ul 
                className="mt-1 space-y-2.5" 
                role="list"
              >
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={cn(
                        "text-sm text-gray-600",
                        "hover:text-gray-900",
                        "transition-all duration-300",
                        "inline-block",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
                        "rounded",
                        "relative",
                        "after:content-[''] after:absolute after:bottom-0 after:left-0",
                        "after:w-0 after:h-px after:bg-gray-900",
                        "after:transition-all after:duration-300",
                        "hover:after:w-full",
                        "transform-gpu hover:translate-x-1"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "mt-12 pt-8 border-t border-gray-200",
          "transform-gpu transition-all duration-500",
          "hover:translate-z-8"
        )}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 order-2 sm:order-1">
              © {currentYear} Titan Surgical Systems. All rights reserved.
            </p>
            <nav 
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 sm:order-2"
              aria-label="Footer navigation"
            >
              {['Privacy Policy', 'Terms of Use', 'Cookie Preferences'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={cn(
                    "text-xs text-gray-500",
                    "hover:text-gray-900",
                    "transition-all duration-300",
                    "relative",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0",
                    "after:w-0 after:h-px after:bg-gray-900",
                    "after:transition-all after:duration-300",
                    "hover:after:w-full"
                  )}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}