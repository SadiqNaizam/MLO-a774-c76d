import React, { useState, useEffect, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from 'react-router-dom';

// Layout Components
import MainAppLayout from '../components/layout/MainAppLayout';
import { HeaderProps, HeaderAction } from '../components/layout/Header'; // Only types needed for props
import Footer, { FooterNavItem } from '../components/layout/Footer';

// Organism (Screen) Components
import OnboardingScreen from '../components/Onboarding/OnboardingScreen';
import AccountOverview from '../components/Account/AccountOverview';
import PaymentScreen from '../components/Payment/PaymentScreen';
import TransactionStatus from '../components/Transaction/TransactionStatus';
import SettingsMenu from '../components/Settings/SettingsMenu';

// Icons from lucide-react
import { Settings, Bell, User, ListChecks, CreditCard, Home as HomeIcon } from 'lucide-react';

// Mock User Data for SettingsMenu
const mockUser = {
  name: 'Alex Thompson',
  email: 'alex.thompson@example.com',
  memberSince: 'June 2022',
  avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=2563EB&color=F9FAFB&size=128',
  initials: 'AT',
};

// Type for app navigation paths (can be extended)
type AppPath = string;

const generateTitleFromPath = (pathSegment: string): string => {
  if (!pathSegment) return '';
  return pathSegment
    .replace('-', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Wrapper for TransactionStatus to handle useParams and provide props
const TransactionStatusPageWrapper: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();

  const isSuccess = transactionId?.includes('success');
  const isFailed = transactionId?.includes('failed');
  // Default to processing if not specified in ID for this mock
  const isProcessing = !isSuccess && !isFailed;

  let status: 'processing' | 'completed' | 'failed' = 'processing' as const;
  let message = "Your payment is processing!";
  let amount = 390.81; // Default example amount

  if (isSuccess) {
    status = 'completed' as const;
    message = "Payment Successful!";
    amount = 125.00; // Example amount for success
  } else if (isFailed) {
    status = 'failed' as const;
    message = "Payment Failed. Please try again.";
    amount = 75.50; // Example amount for failure
  } else if (isProcessing) {
    status = 'processing' as const;
    message = "Payment is currently processing.";
    amount = 210.00; // Example amount for processing
  }

  return (
    <TransactionStatus
      className="h-full bg-background" // Ensures it fills the MainAppLayout content area and has explicit background
      transactionId={transactionId || 'N/A'}
      status={status}
      message={message}
      accountName="Alex Johnson's Savings Account"
      transactionAmount={amount}
      transactionDate={new Date().toLocaleDateString('en-CA')} // Format: YYYY-MM-DD
      onAction={(action) => {
        console.log('TransactionStatus action:', action, 'for ID:', transactionId);
        if (action === 'goHome') navigate('/dashboard');
        else if (action === 'viewDetails') alert(`Viewing details for transaction ${transactionId}`);
        else if (action === 'contactSupport') alert('Contacting support for transaction...');
      }}
    />
  );
};

// Placeholder for uncreated screens that are targets of navigation
const PlaceholderScreen: React.FC<{ title: string; path?: string }> = ({ title, path }) => (
  <div className="p-4 bg-card rounded-lg shadow">
    <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
    <p className="text-muted-foreground">
      This is a placeholder page for {title}.
      {path && <span className="block mt-2 text-sm">Current path: <code className='bg-muted p-1 rounded text-xs'>{path}</code></span>}
    </p>
    <p className="text-muted-foreground mt-4">Content for this section will be implemented soon.</p>
  </div>
);

// Specific wrapper for card details placeholder to use useParams
const PlaceholderScreenWrapperForCardDetails: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  return <PlaceholderScreen title={`Card Details for ${cardId}`} path={useLocation().pathname} />;
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReturningUser, setIsReturningUser] = useState<boolean | null>(null); // null initially to avoid flash

  useEffect(() => {
    const returning = localStorage.getItem('bankease-onboarded') === 'true';
    setIsReturningUser(returning);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigation = (path: AppPath) => {
    navigate(path);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('bankease-onboarded', 'true');
    setIsReturningUser(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('bankease-onboarded');
    setIsReturningUser(false);
    navigate('/onboarding');
  };

  const headerProps: HeaderProps | undefined = useMemo(() => {
    const currentPath = location.pathname;
    let title: string | undefined = 'BankEase';
    let showBackButton = true;
    let onBackButtonClick: (() => void) | undefined = () => navigate(-1);
    let actions: HeaderAction[] | undefined;

    if (currentPath === '/dashboard') {
      title = 'My Account';
      showBackButton = false;
      onBackButtonClick = undefined;
      actions = [
        { icon: Bell, onClick: () => alert('Notifications clicked!'), ariaLabel: 'Notifications' },
        { icon: Settings, onClick: () => navigate('/settings'), ariaLabel: 'Settings' },
      ];
    } else if (currentPath.startsWith('/payment')) {
      title = 'Make a Payment';
    } else if (currentPath.startsWith('/transaction-status')) {
      title = 'Transaction Status';
    } else if (currentPath.startsWith('/settings')) {
      const pathSegments = currentPath.substring('/settings'.length).split('/').filter(s => s);
      const settingPage = pathSegments[0];
      title = settingPage ? generateTitleFromPath(settingPage) : 'Settings';
      // Show back button for sub-settings pages, not for main /settings if accessed directly (e.g. from footer)
      showBackButton = !!settingPage; 
    } else if (currentPath === '/request') {
      title = 'Request Money';
    } else if (currentPath === '/add-money') {
      title = 'Add Money';
    } else if (currentPath === '/more-actions') {
      title = 'More Actions';
    } else if (currentPath === '/cards/manage') {
      title = 'Manage Cards';
    } else if (currentPath.startsWith('/cards/')) {
      const cardId = currentPath.substring('/cards/'.length);
      title = cardId !== 'manage' ? `Card ${generateTitleFromPath(cardId)}` : 'Manage Cards';
    } else if (currentPath === '/transactions') {
      title = 'All Transactions';
    }

    if (currentPath === '/onboarding') return undefined;
    return { title, showBackButton, onBackButtonClick, actions };
  }, [location.pathname, navigate]);

  const footerNavItems: FooterNavItem[] = useMemo(() => [
    { id: 'dashboard', label: 'Home', icon: HomeIcon, onClick: () => navigate('/dashboard') },
    { id: 'transactions', label: 'History', icon: ListChecks, onClick: () => navigate('/transactions') },
    { id: 'cards', label: 'Cards', icon: CreditCard, onClick: () => navigate('/cards/manage') },
    { id: 'settings', label: 'Profile', icon: User, onClick: () => navigate('/settings') },
  ], [navigate]);

  const activeFooterItemId = useMemo(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/dashboard')) return 'dashboard';
    if (currentPath.startsWith('/transactions')) return 'transactions';
    if (currentPath.startsWith('/cards')) return 'cards';
    if (currentPath.startsWith('/settings')) return 'settings';
    return undefined;
  }, [location.pathname]);

  const showFooter = useMemo(() => {
    const currentPath = location.pathname;
    // Hide footer on specific screens that are usually full-focus or transitional
    if (currentPath === '/onboarding' || currentPath.startsWith('/transaction-status') || currentPath.startsWith('/payment')) {
      return false;
    }
    return true;
  }, [location.pathname]);

  if (isReturningUser === null) {
    return <div className="h-screen w-screen bg-background" />; // Or a loading spinner
  }

  if (location.pathname === '/') {
    return <Navigate to={isReturningUser ? '/dashboard' : '/onboarding'} replace />;
  }
  if (!isReturningUser && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  if (isReturningUser && location.pathname === '/onboarding'){
    return <Navigate to="/dashboard" replace />;
  }

  const pathsRequiringFullBleed = [
    '/dashboard',
    '/settings',
    '/transaction-status'
  ];
  const shouldUseFullBleedContent = pathsRequiringFullBleed.some(path => location.pathname.startsWith(path));
  const mainAppLayoutContentContainerClass = shouldUseFullBleedContent ? '!p-0 !space-y-0' : undefined;

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/onboarding" element={<OnboardingScreen onGetStarted={handleOnboardingComplete} />} />
          
          <Route path="/dashboard" element={<MainAppLayout headerProps={headerProps} rootClassName="h-full" contentContainerClassName={mainAppLayoutContentContainerClass}><AccountOverview onNavigate={handleNavigation} className="h-full" /></MainAppLayout>} />
          <Route path="/payment" element={<MainAppLayout headerProps={headerProps} rootClassName="h-full" contentContainerClassName={mainAppLayoutContentContainerClass}><PaymentScreen onPaymentProcess={(details) => { console.log('Payment processing:', details); navigate(`/transaction-status/processing-${Date.now()}`); }} onCancel={() => navigate(-1)} /></MainAppLayout>} />
          <Route path="/transaction-status/:transactionId" element={<MainAppLayout headerProps={headerProps} rootClassName="h-full" contentContainerClassName={mainAppLayoutContentContainerClass}><TransactionStatusPageWrapper /></MainAppLayout>} />
          <Route path="/settings/*" element={<MainAppLayout headerProps={headerProps} rootClassName="h-full" contentContainerClassName={mainAppLayoutContentContainerClass}><SettingsMenu user={mockUser} onLogout={handleLogout} onNavigate={handleNavigation} className="h-full" /></MainAppLayout>} />
          
          {['/request', '/add-money', '/more-actions', '/cards/manage', '/transactions'].map(path => (
            <Route key={path} path={path} element={<MainAppLayout headerProps={headerProps} rootClassName="h-full" contentContainerClassName={mainAppLayoutContentContainerClass}><PlaceholderScreen title={generateTitleFromPath(path.substring(1))} path={path} /></MainAppLayout>} />
          ))}
          <Route path="/cards/:cardId" element={<MainAppLayout headerProps={headerProps} rootClassName="h-full" contentContainerClassName={mainAppLayoutContentContainerClass}><PlaceholderScreenWrapperForCardDetails /></MainAppLayout>} />

          <Route path="*" element={<Navigate to={isReturningUser ? "/dashboard" : "/onboarding"} replace />} /> 
        </Routes>
      </div>
      {showFooter && <Footer navItems={footerNavItems} activeItemId={activeFooterItemId} />}
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default IndexPage;
