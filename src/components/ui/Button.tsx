import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'relative overflow-hidden rounded-full font-medium',
        'transform-gpu transition-all duration-300',
        'active:scale-95',
        'flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Hover and active states with modern effects
        'before:absolute before:inset-0 before:transition-all before:duration-300',
        'before:bg-gradient-to-r before:opacity-0 hover:before:opacity-100',
        'after:absolute after:inset-0 after:transition-transform after:duration-500',
        'after:bg-white/10 after:scale-x-0 hover:after:scale-x-100',
        'hover:shadow-lg hover:-translate-y-0.5',
        
        // Click effect
        'active:shadow-inner active:translate-y-0',
        
        // Variants
        {
          // Primary variant
          'bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white before:from-blue-50/50 before:to-transparent focus:ring-blue-500': 
            variant === 'primary',
          'after:origin-left': variant === 'primary',
          
          // Secondary variant
          'bg-gray-900/90 backdrop-blur-sm text-white hover:bg-gray-900 before:from-white/10 before:to-transparent focus:ring-gray-500':
            variant === 'secondary',
          'after:origin-right': variant === 'secondary',
          
          // Sizes
          'px-4 py-1.5 text-sm': size === 'sm',
          'px-6 py-2 text-base': size === 'md',
          'px-8 py-2.5 text-base sm:text-lg': size === 'lg',
        },
        
        // Custom ripple effect on mobile
        'touch-feedback',
        
        className
      )}
      {...props}
    />
  );
}