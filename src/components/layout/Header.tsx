import React, { useState, useEffect, useCallback } from 'react';
import { Search, Menu as MenuIcon, X } from 'lucide-react';
import { Menu } from './Menu';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { navigationItems } from '../../config/header-menu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY < lastScrollY || currentScrollY < 120);
    setIsSticky(currentScrollY > 120);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
    setActiveDropdown(null);
  }, []);

  const handleDropdownHover = (label: string | null) => {
    setActiveDropdown(label);
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "transform-gpu",
          isSticky ? "bg-white shadow-md h-14 sm:h-16" : "bg-transparent h-16 sm:h-20",
          !isVisible && !isMenuOpen && "translate-y-[-100%]"
        )}
        onMouseLeave={() => handleDropdownHover(null)}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/"
              className={cn(
                "text-xl sm:text-2xl font-medium",
                "transition-colors duration-300",
                isSticky ? "text-gray-900 hover:text-gray-700" : "text-white hover:text-white/90"
              )}
            >
              Titan Surgical Systems
            </Link>
          </div>

          {/* Main Navigation - Desktop */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-1">
              {navigationItems.map((item) => (
                <li 
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownHover(item.label)}
                >
                  <button 
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium",
                      "transition-all duration-300",
                      "relative overflow-hidden group",
                      isSticky 
                        ? "text-gray-900 hover:bg-gray-100" 
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </button>

                  {/* Mega Menu Dropdown */}
                  {activeDropdown === item.label && (
                    <div 
                      className="absolute left-0 min-w-[300px] bg-white shadow-lg rounded-lg mt-2 py-2"
                      style={{
                        transform: 'translateX(-25%)'
                      }}
                    >
                      {item.sections.map((section) => (
                        <div key={section.title} className="px-4 py-2">
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            {section.title}
                          </h3>
                          <ul className="space-y-1">
                            {section.items.map((link) => (
                              <li key={link.label}>
                                <Link
                                  to={link.href}
                                  className="block px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Navigation */}
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleSearch}
              className={cn(
                "p-2 rounded-full",
                "transition-all duration-300",
                isSticky 
                  ? "hover:bg-gray-100 text-gray-900" 
                  : "hover:bg-white/10 text-white"
              )}
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                "p-2 rounded-full",
                "transition-all duration-300",
                isSticky 
                  ? "hover:bg-gray-100 text-gray-900" 
                  : "hover:bg-white/10 text-white"
              )}
              aria-label="Menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          "transition-opacity duration-300",
          isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 bg-white",
            "transform transition-transform duration-300",
            isSearchOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-3 text-lg bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={toggleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Menu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}