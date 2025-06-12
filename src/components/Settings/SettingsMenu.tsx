import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Languages, Bell, Settings2, LifeBuoy, LogOut, ChevronRight, ShieldCheck, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  avatarUrl?: string;
  initials: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SettingsMenuProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  className?: string;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  user,
  onLogout,
  onNavigate,
  className,
}) => {
  const menuItems: MenuItem[] = [
    { id: 'profile', label: 'Account Holder', icon: User, path: '/settings/profile' },
    { id: 'language', label: 'Preferred Language', icon: Languages, path: '/settings/language' },
    { id: 'notifications', label: 'Notification Settings', icon: Bell, path: '/settings/notifications' },
    { id: 'security', label: 'Security & Privacy', icon: ShieldCheck, path: '/settings/security' },
    { id: 'app', label: 'App Preferences', icon: Settings2, path: '/settings/app' },
    { id: 'documents', label: 'Statements & Documents', icon: FileText, path: '/settings/documents' },
    { id: 'support', label: 'Customer Support', icon: LifeBuoy, path: '/settings/support' },
  ];

  return (
    <ScrollArea className={cn('h-[calc(100vh-4rem)]', className)}>
      <div className="p-4 flex flex-col min-h-full">
        <div className="flex items-center space-x-4 p-4 mb-6 bg-card rounded-lg shadow">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-xl">{user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">Member since {user.memberSince}</p>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow flex-grow">
          <ul className="divide-y divide-border">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start items-center h-14 px-4 text-left rounded-none first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => onNavigate(item.path)}
                >
                  <item.icon className="mr-3 h-5 w-5 text-primary" />
                  <span className="flex-grow text-foreground text-sm font-medium">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6">
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/50 hover:text-destructive" onClick={onLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default SettingsMenu;
