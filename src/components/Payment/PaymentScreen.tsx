import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, CreditCard, User, Send, AlertTriangle } from 'lucide-react';

interface PaymentScreenProps {
  initialAmount?: number;
  onPaymentProcess: (details: { amount: number; payeeId: string; cardId: string; note?: string }) => void;
  onCancel?: () => void;
  className?: string;
}

interface SelectOption {
  id: string;
  label: string;
  details?: string;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  initialAmount = 0,
  onPaymentProcess,
  onCancel,
  className,
}) => {
  const [amount, setAmount] = useState<string>(initialAmount > 0 ? initialAmount.toFixed(2) : '');
  const [selectedPayee, setSelectedPayee] = useState<string | undefined>(undefined);
  const [selectedCard, setSelectedCard] = useState<string | undefined>(undefined);
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; payee?: string; card?: string }>({});

  const payeeAccountsData: SelectOption[] = [
    { id: 'payee1', label: 'John Doe', details: 'Savings ****1234' },
    { id: 'payee2', label: 'Utility Services Inc.', details: 'Bill ****5678' },
    { id: 'payee3', label: 'Online Store', details: 'Order #98765' },
  ];

  const paymentCardsData: SelectOption[] = [
    { id: 'card1', label: 'Visa ****1111', details: 'Expires 12/25' },
    { id: 'card2', label: 'Mastercard ****2222', details: 'Expires 08/26' },
    { id: 'card3', label: 'Amex ****3333', details: 'Expires 01/24 (Expired)' }, // Example of a disabled option logic potential
  ];

  const validateForm = useCallback(() => {
    const newErrors: { amount?: string; payee?: string; card?: string } = {};
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount.';
    }
    if (!selectedPayee) {
      newErrors.payee = 'Please select a payee.';
    }
    if (!selectedCard) {
      newErrors.card = 'Please select a payment card.';
    }
    // Example for expired card (not fully implemented here for simplicity, but shows where to put it)
    if (selectedCard === 'card3') {
        // newErrors.card = 'This card is expired.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, selectedPayee, selectedCard]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      onPaymentProcess({
        amount: parseFloat(amount),
        payeeId: selectedPayee!,
        cardId: selectedCard!,
        note,
      });
    }
  }, [validateForm, onPaymentProcess, amount, selectedPayee, selectedCard, note]);

  return (
    <div className={cn('p-4 sm:p-6 max-w-2xl mx-auto bg-background', className)}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">Make a Payment</CardTitle>
          {initialAmount > 0 && (
            <CardDescription>
              Paying a pre-filled amount of ${initialAmount.toFixed(2)}
            </CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className={cn(errors.amount && 'text-destructive')}>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn('pl-10', errors.amount && 'border-destructive focus-visible:ring-destructive')}
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                />
              </div>
              {errors.amount && <p id="amount-error" className="text-sm text-destructive flex items-center"><AlertTriangle className='w-4 h-4 mr-1'/>{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payee" className={cn(errors.payee && 'text-destructive')}>Payee Account</Label>
              <Select value={selectedPayee} onValueChange={setSelectedPayee}>
                <SelectTrigger id="payee" className={cn(errors.payee && 'border-destructive focus:ring-destructive')} aria-invalid={!!errors.payee} aria-describedby={errors.payee ? "payee-error" : undefined}>
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a payee" />
                </SelectTrigger>
                <SelectContent>
                  {payeeAccountsData.map((payee) => (
                    <SelectItem key={payee.id} value={payee.id}>
                      <div className="flex flex-col">
                        <span>{payee.label}</span>
                        {payee.details && <span className="text-xs text-muted-foreground">{payee.details}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payee && <p id="payee-error" className="text-sm text-destructive flex items-center"><AlertTriangle className='w-4 h-4 mr-1'/>{errors.payee}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="card" className={cn(errors.card && 'text-destructive')}>Payment Card</Label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger id="card" className={cn(errors.card && 'border-destructive focus:ring-destructive')} aria-invalid={!!errors.card} aria-describedby={errors.card ? "card-error" : undefined}>
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {paymentCardsData.map((card) => (
                    <SelectItem key={card.id} value={card.id} disabled={card.id === 'card3'}> {/* Example: disable expired card */}
                      <div className="flex flex-col">
                        <span>{card.label}</span>
                        {card.details && <span className="text-xs text-muted-foreground">{card.details}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.card && <p id="card-error" className="text-sm text-destructive flex items-center"><AlertTriangle className='w-4 h-4 mr-1'/>{errors.card}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input
                id="note"
                placeholder="E.g., For birthday gift"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
            )}
            <Button type="submit" className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" /> Proceed to Pay
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PaymentScreen;
