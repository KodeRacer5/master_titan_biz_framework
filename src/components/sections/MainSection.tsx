import React from 'react';
import { cn } from '../../utils/cn';

interface MainSectionProps {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLast?: boolean;
  id?: string;
  allowedEdits?: string[];
  children?: React.ReactNode;
  className?: string;
}

export const MainSection: React.FC<MainSectionProps> = ({
  size = 'md',
  fullWidth = false,
  isLast = false,
  id,
  allowedEdits,
  children,
  className,
  ...props
}) => {
  return (
    <section
      id={id}
      data-section-id={id}
      data-allowed-edits={allowedEdits?.join(',')}
      className={cn(
        "relative w-full",
        "snap-start snap-always",
        isLast && "snap-end",
        {
          'min-h-screen': size === 'lg',
          'min-h-[85vh]': size === 'md',
          'min-h-[70vh]': size === 'sm',
          'container mx-auto px-6': !fullWidth
        },
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};