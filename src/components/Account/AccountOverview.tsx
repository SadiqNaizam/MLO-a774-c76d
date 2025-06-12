import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowRightLeft, CreditCard, DollarSign, TrendingUp, TrendingDown, ChevronRight, Send, Download, PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

interface AccountOverviewProps {
  className?: string;
  onNavigate: (path: string) => void;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense' as const;
  status: 'completed' | 'pending' | 'failed' as const;
}

interface PaymentCard {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  brand: 'Visa' | 'Mastercard' | 'Amex' as const;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ className, onNavigate }) => {
  const balance = 8250.75;

  const paymentCardsData: PaymentCard[] = [
    { id: 'pc1', name: 'Business Card', last4: '1234', expiry: '12/25', brand: 'Visa' as const },
    { id: 'pc2', name: 'Personal Card', last4: '5678', expiry: '06/24', brand: 'Mastercard' as const },
  ];

  const transactionsData: Transaction[] = [
    { id: 't1', description: 'Salary Deposit', amount: 3500, date: '2024-07-15', type: 'income' as const, status: 'completed' as const },
    { id: 't2', description: 'Online Shopping', amount: -120.50, date: '2024-07-14', type: 'expense' as const, status: 'completed' as const },
    { id: 't3', description: 'Utility Bill', amount: -75.00, date: '2024-07-12', type: 'expense' as const, status: 'pending' as const },
    { id: 't4', description: 'Freelance Payment', amount: 800, date: '2024-07-10', type: 'income' as const, status: 'completed' as const },
    { id: 't5', description: 'Restaurant Dinner', amount: -55.20, date: '2024-07-09', type: 'expense' as const, status: 'completed' as const },
  ];

  const monthlySpendingData = [
    { name: 'Jan', expenses: 400, income: 600 },
    { name: 'Feb', expenses: 300, income: 500 },
    { name: 'Mar', expenses: 600, income: 750 },
    { name: 'Apr', expenses: 200, income: 400 },
    { name: 'May', expenses: 700, income: 900 },
    { name: 'Jun', expenses: 500, income: 650 },
  ];

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? <TrendingUp className="h-5 w-5 text-success" /> : <TrendingDown className="h-5 w-5 text-destructive" />;
  };

  return (
    <ScrollArea className={cn('h-[calc(100vh-4rem)]', className)}>
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-auto p-3 items-center" onClick={() => onNavigate('/payment')}>
              <Send className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs">Send</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto p-3 items-center" onClick={() => onNavigate('/request')}>
              <Download className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs">Request</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto p-3 items-center" onClick={() => onNavigate('/add-money')}>
              <PlusCircle className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs">Add Money</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto p-3 items-center" onClick={() => onNavigate('/more-actions')}>
              <MoreHorizontal className="h-6 w-6 mb-1 text-primary" />
              <span className="text-xs">More</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>Income vs Expenses (Last 6 Months)</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendingData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} 
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{fontSize: "12px"}} />
                <Bar dataKey="income" name="Income" radius={[4, 4, 0, 0]}>
                    {monthlySpendingData.map((entry, index) => (
                        <Cell key={`cell-income-${index}`} fill="hsl(var(--success))" />
                    ))}
                </Bar>
                <Bar dataKey="expenses" name="Expenses" radius={[4, 4, 0, 0]}>
                    {monthlySpendingData.map((entry, index) => (
                        <Cell key={`cell-expense-${index}`} fill="hsl(var(--destructive))" />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Cards</CardTitle>
            <Button variant="link" size="sm" className="absolute top-4 right-4" onClick={() => onNavigate('/cards/manage')}>Manage</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentCardsData.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => onNavigate(`/cards/${card.id}`)}>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-foreground">{card.name}</p>
                    <p className="text-xs text-muted-foreground">**** **** **** {card.last4} ({card.brand})</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="link" size="sm" className="absolute top-4 right-4" onClick={() => onNavigate('/transactions')}>View All</Button>
          </CardHeader>
          <CardContent>
            {transactionsData.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent transactions.</p>
            ) : (
              <ul className="space-y-1">
                {transactionsData.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <li className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-sm text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date} - <span className={cn(transaction.status === 'completed' && 'text-success', transaction.status === 'pending' && 'text-yellow-500', transaction.status === 'failed' && 'text-destructive')}>{transaction.status}</span></p>
                        </div>
                      </div>
                      <p className={cn('font-semibold text-sm', transaction.type === 'income' ? 'text-success' : 'text-foreground')}>
                        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </li>
                    {index < transactionsData.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default AccountOverview;
