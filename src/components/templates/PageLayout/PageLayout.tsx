import React from 'react';
import styles from './PageLayout.module.scss';

export interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
  className = '',
}) => {
  return (
    <div className={`page-layout ${className}`}>
      {header && (
        <header className="page-layout__header">
          {header}
        </header>
      )}
      
      <div className="page-layout__body">
        {sidebar && (
          <aside className="page-layout__sidebar">
            {sidebar}
          </aside>
        )}
        
        <main className="page-layout__main">
          {children}
        </main>
      </div>
      
      {footer && (
        <footer className="page-layout__footer">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default PageLayout;