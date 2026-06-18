import React from 'react';
import { getThemeClasses } from '../theme';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  theme?: string;
}

export function BaseLayout({ children, className = '', theme = 'pink' }: BaseLayoutProps) {
  const themeClasses = getThemeClasses(theme);

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} ${className}`}>
      {children}
    </div>
  );
}

export default BaseLayout;
