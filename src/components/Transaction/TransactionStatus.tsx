import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, XCircle, MessageSquare, FileText, Home } from 'lucide-react';

interface TransactionStatusProps {
  transactionId: string;
  status: 'processing' | 'completed' | 'failed' as const;
  message: string;
  accountName: string;
  transactionAmount?: number;
  transactionDate?: string;
  onAction: (action: 'contactSupport' | 'viewDetails' | 'goHome') => void;
  className?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  status,
  message,
  accountName,
  transactionAmount,
  transactionDate,
  onAction,
  className,
}) => {
  const StatusIcon = React.useMemo(() => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={64} className="text-success" />;
      case 'processing':
        return <AlertCircle size={64} className="text-yellow-500 animate-pulse" />;
      case 'failed':
        return <XCircle size={64} className="text-destructive" />;
      default:
        return <AlertCircle size={64} className="text-muted-foreground" />;
    }
  }, [status]);

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-screen bg-background p-6', className)}>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pt-8">
          <div className="mx-auto mb-6">
            {StatusIcon}
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">{message}</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Transaction for {accountName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactionAmount !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium text-foreground">${Math.abs(transactionAmount).toFixed(2)}</span>
            </div>
          )}
          {transactionDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground">{transactionDate}</span>
            </div>
          )}
           <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className={cn(
                "font-medium",
                status === 'completed' && 'text-success',
                status === 'processing' && 'text-yellow-500',
                status === 'failed' && 'text-destructive'
              )}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 pt-6 pb-8">
          <Button variant="outline" className="w-full" onClick={() => onAction('contactSupport')}>
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onAction('viewDetails')}>
            <FileText className="mr-2 h-4 w-4" /> View Details
          </Button>
          <Button className="w-full" onClick={() => onAction('goHome')}>
            <Home className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransactionStatus;
