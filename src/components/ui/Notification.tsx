import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { NotificationType } from '../../utils/notify/NotificationManager';

interface NotificationProps {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  onDismiss: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const styles = {
  info: 'bg-blue-50 text-blue-600',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-yellow-50 text-yellow-600',
  error: 'bg-red-50 text-red-600',
};

export function Notification({
  id,
  type,
  title,
  message,
  onDismiss,
  action,
  duration
}: NotificationProps) {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg',
        'transform transition-all duration-500 ease-in-out',
        styles[type]
      )}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className="mt-1 text-sm">
              {message}
            </p>
            {action && (
              <div className="mt-3 flex space-x-4">
                <button
                  onClick={action.onClick}
                  className={cn(
                    'text-sm font-medium',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'rounded-md px-3 py-1.5',
                    type === 'error' ? 'bg-red-100 hover:bg-red-200' : 'bg-white/20 hover:bg-white/30'
                  )}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                'hover:opacity-75 transition-opacity'
              )}
              onClick={() => onDismiss(id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}