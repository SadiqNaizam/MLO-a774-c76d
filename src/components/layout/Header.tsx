import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

// Define HeaderAction outside if it's used by other components, or inline if specific to Header
export interface HeaderAction {
  icon: React.ElementType; // lucide-react icon component
  onClick: () => void;
  ariaLabel: string;
}

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  actions?: HeaderAction[];
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackButtonClick,
  actions,
  className,
}) => {
  return (
    <header
      className={cn(
        'h-16 sticky top-0 z-50 flex items-center bg-background px-4 border-b border-border shadow-sm',
        className
      )}
    >
      <div className="flex items-center flex-shrink-0">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackButtonClick}
            aria-label="Go back"
            className="-ml-2 mr-2" // Adjust margins for visual alignment
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
      </div>

      <div className="flex-1 flex justify-center min-w-0 px-2">
        {/* Title is centered. If back button is present, it might push title slightly. 
            If no back button and no actions, title can be left-aligned by adjusting parent flex props.
            For a typically centered mobile title:
        */}
        {title && (
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center space-x-1 flex-shrink-0">
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            onClick={action.onClick}
            aria-label={action.ariaLabel}
          >
            <action.icon className="h-5 w-5 text-foreground" />
          </Button>
        ))}
      </div>
    </header>
  );
};

export default Header;
