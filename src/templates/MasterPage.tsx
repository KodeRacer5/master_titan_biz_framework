import React, { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SEO } from '../components/layout/SEO';
import { SectionLock } from '../utils/sections/SectionLock';
import { TemplateManager } from '../utils/templates/TemplateManager';
import { cn } from '../utils/cn';

interface MasterPageProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  headerSlot?: React.ReactNode;
  contentSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
}

export function MasterPage({
  title,
  description,
  children,
  headerSlot,
  contentSlot,
  footerSlot,
  className
}: MasterPageProps) {
  const sectionLock = SectionLock.getInstance();
  const templateManager = TemplateManager.getInstance();

  useEffect(() => {
    // Lock the master page structure
    const template = templateManager.getTemplate('master-page');
    if (template) {
      template.slots.forEach(slot => {
        const element = document.querySelector(`[data-slot="${slot.id}"]`);
        if (element && slot.isLocked) {
          sectionLock.lockSection(
            `master-page-${slot.id}`,
            element.innerHTML,
            {
              isProtected: true,
              allowedModifications: slot.allowedModifications
            }
          );
        }
      });
    }
  }, []);

  return (
    <>
      <SEO 
        title={title}
        description={description}
      />
      
      <div 
        className={cn(
          "flex flex-col min-h-screen",
          "transform-gpu",
          className
        )}
        data-template="master-page"
      >
        {/* Header Slot */}
        <div 
          data-slot="header"
          data-locked="true"
          className="flex-shrink-0"
        >
          {headerSlot || <Header />}
        </div>

        {/* Main Content Slot */}
        <main 
          role="main"
          data-slot="content-block"
          className="flex-1"
        >
          {contentSlot || children}
        </main>

        {/* Footer Slot */}
        <div 
          data-slot="footer"
          data-locked="true"
          className="flex-shrink-0"
        >
          {footerSlot || <Footer />}
        </div>
      </div>
    </>
  );
}