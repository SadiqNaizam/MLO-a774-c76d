import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react'; // Using Rocket as a placeholder for an engaging onboarding image

interface OnboardingScreenProps {
  onGetStarted: () => void;
  className?: string;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center',
        className
      )}
    >
      <Rocket size={128} className="mb-8 text-primary" strokeWidth={1.5} />
      <h1 className="text-4xl font-bold text-foreground mb-3">
        BankEase
      </h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-sm">
        Your banking, simplified. Manage your finances with ease and confidence.
      </p>
      <Button size="lg" onClick={onGetStarted} className="w-full max-w-xs">
        Get Started
      </Button>
    </div>
  );
};

export default OnboardingScreen;
