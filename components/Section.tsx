import React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ title, children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`py-12 px-4 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {title && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">{title}</h2>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
