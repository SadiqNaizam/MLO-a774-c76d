import React from 'react';
import { cn } from '@/lib/utils';
import Header, { HeaderProps } from './Header'; // Assuming Header.tsx is in the same directory
// Footer import is not needed here if MainAppLayout does not render it directly based on project requirements.

interface MainAppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps; // Props for the Header component, optional
  rootClassName?: string; // For the outermost div (flex flex-col h-screen)
  mainClassName?: string; // For the <main> element (flex-1 overflow-y-auto)
  contentContainerClassName?: string; // For the div inside <main> that wraps children
}

const MainAppLayout: React.FC<MainAppLayoutProps> = ({
  children,
  headerProps,
  rootClassName,
  mainClassName,
  contentContainerClassName,
}) => {
  return (
    <div className={cn('flex flex-col h-screen bg-background', rootClassName)}>
      {/* Render Header only if headerProps are provided */}
      {headerProps && <Header {...headerProps} />}
      
      <main className={cn('flex-1 overflow-y-auto', mainClassName)}>
        {/* 
          Layout Requirements -> mainContent -> container: "p-4 space-y-4"
          This class is applied here. If children are multiple distinct blocks, space-y-4 will separate them.
          If children is a single component (e.g., a full-page scrollable view like AccountOverview),
          that component will manage its own internal padding and spacing if needed beyond this container's p-4.
        */}
        <div className={cn('p-4 space-y-4', contentContainerClassName)}>
          {children}
        </div>
      </main>
      
      {/* 
        Footer is not part of this MainAppLayout based on:
        Project Requirements -> Component Hierarchy -> templates -> MobileAppLayout.composition: ["Header", "MainContentArea"]
        If a footer is needed globally and fixed, this layout would need adjustment (e.g., main content padding-bottom).
        The generated Footer.tsx can be used by specific pages or a different layout component if required.
      */}
    </div>
  );
};

export default MainAppLayout;
