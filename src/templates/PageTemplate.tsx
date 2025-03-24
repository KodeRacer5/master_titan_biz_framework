import React from 'react';
import { MasterPage } from './MasterPage';
import { cn } from '../utils/cn';

interface PageTemplateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageTemplate({
  title,
  description,
  children,
  className
}: PageTemplateProps) {
  return (
    <MasterPage
      title={title}
      description={description}
      className={cn("page-template", className)}
      contentSlot={
        <div className="page-content">
          {children}
        </div>
      }
    />
  );
}