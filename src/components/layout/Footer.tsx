import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, ListChecks, CreditCard, User as UserIcon } from 'lucide-react'; // Renamed User to UserIcon to avoid conflict

export interface FooterNavItem {
  id: string;
  label: string;
  icon: React.ElementType; // lucide-react icon component
  href?: string; // Optional: if using React Router Link
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface FooterProps {
  navItems?: FooterNavItem[];
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

const defaultNavItems: FooterNavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'history', label: 'History', icon: ListChecks },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: UserIcon },
];

const Footer: React.FC<FooterProps> = ({
  navItems = defaultNavItems,
  activeItemId,
  onItemClick,
  className,
}) => {
  const handleItemClick = (item: FooterNavItem, event: React.MouseEvent<HTMLButtonElement>) => {
    if (item.onClick) {
      item.onClick(event);
    }
    if (onItemClick) {
      onItemClick(item.id);
    }
  };

  return (
    <footer
      className={cn(
        'h-16 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-background border-t border-border shadow-t-sm',
        className
      )}
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = item.id === activeItemId;
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={(e) => handleItemClick(item, e)}
            className={cn(
              'flex flex-col items-center justify-center h-full p-2 rounded-none flex-1',
              isActive ? 'text-primary' : 'text-muted-foreground',
              'hover:bg-accent hover:text-accent-foreground'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <IconComponent className="h-6 w-6 mb-0.5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        );
      })}
    </footer>
  );
};

export default Footer;
