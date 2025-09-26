import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  links?: Array<{
    id: string;
    label: string;
  }>;
  className?: string;
}

/**
 * SkipLink component
 * Provides keyboard-accessible "skip" links for quick navigation and improved accessibility
 */
const SkipLink: React.FC<SkipLinkProps> = ({
  links = [
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'main-navigation', label: 'Skip to navigation' }
  ],
  className
}) => {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-[100] flex gap-2 p-2',
        className
      )}
    >
      {links.map(link => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="
            absolute top-0 left-0 p-2
            transform -translate-y-full transition-transform duration-200
            focus:translate-y-0 focus:relative focus:block
            bg-primary-cyan-500 text-white text-sm font-medium
            rounded-b-md shadow-md z-[100]
          "
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(link.id);
            if (element) {
              element.setAttribute('tabindex', '-1');
              element.focus();
              
              // Remove tabindex after focus to avoid disrupting natural tab order
              setTimeout(() => {
                element.removeAttribute('tabindex');
              }, 1000);
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default SkipLink;
