import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { navigationItems } from '../../config/header-menu';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [currentItems, setCurrentItems] = useState(navigationItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setHistory([]);
        setCurrentItems(navigationItems);
      }, 300);
    }
  }, [isOpen]);

  const navigateToSubmenu = (label: string, items: any) => {
    setHistory(prev => [...prev, label]);
    setCurrentItems(items);
  };

  const navigateBack = () => {
    setHistory(prev => {
      const newHistory = prev.slice(0, -1);
      let items = navigationItems;
      newHistory.forEach(label => {
        const section = items.find(item => item.label === label);
        if (section) {
          items = section.sections;
        }
      });
      setCurrentItems(items);
      return newHistory;
    });
  };

  if (!mounted) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-y-0 right-0 flex w-full max-w-sm">
        <Dialog.Panel className="w-full bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={navigateBack}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-4 h-4 transform rotate-180" />
                </button>
              )}
              <span className="text-sm font-medium">
                {history.length > 0 ? history[history.length - 1] : 'Menu'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              {currentItems.map((item: any) => (
                <li key={item.label}>
                  {item.sections ? (
                    <button
                      onClick={() => navigateToSubmenu(item.label, item.sections)}
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left",
                        "rounded-lg transition-colors",
                        "hover:bg-gray-100",
                        "flex items-center justify-between"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "block px-3 py-2 text-sm",
                        "rounded-lg transition-colors",
                        "hover:bg-gray-100"
                      )}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}