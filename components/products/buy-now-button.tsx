"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingBag, CreditCard, Zap } from 'lucide-react';
import { useBuyNow } from '@/hooks/use-buy-now';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
}

interface BuyNowButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const paymentMethods = [
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'paypal', label: 'PayPal', icon: '💙' },
  { value: 'stripe', label: 'Stripe (Credit/Debit)', icon: '💳' },
  { value: 'momo', label: 'MoMo Wallet', icon: '📱' },
  { value: 'zalopay', label: 'ZaloPay', icon: '⚡' },
] as const;

export function BuyNowButton({ 
  product, 
  className = '', 
  size = 'default',
  variant = 'default' 
}: BuyNowButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [notes, setNotes] = useState('');
  const [canBuy, setCanBuy] = useState<boolean | null>(null);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);
  
  const { buyNow, checkAvailability, isLoading } = useBuyNow();
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();

  // Check if user can buy this product
  useEffect(() => {
    const checkBuyAvailability = async () => {
      if (user && product.id) {
        const availability = await checkAvailability(product.id, user.id);
        if (availability) {
          setCanBuy(availability.canBuy);
          if (availability.availablePaymentMethods) {
            setAvailablePaymentMethods(availability.availablePaymentMethods);
          }
        }
      }
    };

    if (user && !authLoading) {
      checkBuyAvailability();
    }
  }, [user, product.id, authLoading, checkAvailability]);

  const handleBuyClick = () => {
    if (!user) {
      toast.error('Please log in to make a purchase');
      router.push('/login');
      return;
    }

    if (canBuy === false) {
      toast.error('This product cannot be purchased at the moment');
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!user || !paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const result = await buyNow({
      productId: product.id,
      userId: user.id,
      paymentMethod: paymentMethod as 'bank_transfer' | 'paypal' | 'stripe' | 'momo' | 'zalopay',
      couponCode: couponCode.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (result?.success) {
      setIsDialogOpen(false);
      // Redirect to payment or order page
      router.push(result.nextSteps.paymentUrl);
    }
  };

  const totalAmount = product.price;
  const selectedPaymentMethodInfo = paymentMethods.find(pm => pm.value === paymentMethod);

  if (authLoading) {
    return (
      <Button disabled className={className} size={size} variant={variant}>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleBuyClick}
        className={className}
        size={size}
        variant={variant}
        disabled={isLoading || canBuy === false}
      >
        <Zap className="w-4 h-4 mr-2" />
        Buy Now
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Complete Your Purchase
            </DialogTitle>
            <DialogDescription>
              Review your order and select a payment method to continue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Summary */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{product.title}</h4>
                  <Badge variant="secondary" className="mt-1">
                    Digital Product
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods
                    .filter(pm => availablePaymentMethods.includes(pm.value))
                    .map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <span>{method.icon}</span>
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon Code (Optional)</Label>
              <Input
                id="coupon"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any special notes for your order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Info */}
            {selectedPaymentMethodInfo && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedPaymentMethodInfo.label}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  You will be redirected to complete your payment securely.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={isLoading || !paymentMethod}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
