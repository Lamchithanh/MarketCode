import { useState } from 'react';
import { toast } from 'sonner';

interface BuyNowRequest {
  productId: string;
  userId: string;
  paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'momo' | 'zalopay';
  couponCode?: string;
  notes?: string;
}

interface BuyNowResponse {
  success: boolean;
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    originalAmount: number;
    discountAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
  };
  product: {
    id: string;
    title: string;
    price: number;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  coupon: {
    code: string;
    name: string;
    type: string;
    value: number;
    discountApplied: number;
  } | null;
  nextSteps: {
    message: string;
    paymentUrl: string;
    redirectUrl: string;
  };
}

interface BuyNowAvailability {
  canBuy: boolean;
  reason?: string;
  product?: {
    id: string;
    title: string;
    price: number;
  };
  availablePaymentMethods?: string[];
}

export function useBuyNow() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (productId: string, userId: string): Promise<BuyNowAvailability | null> => {
    try {
      setError(null);
      const response = await fetch(`/api/orders/buy-now?productId=${productId}&userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to check availability');
        return null;
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      toast.error(`Failed to check product availability: ${errorMessage}`);
      return null;
    }
  };

  const buyNow = async (data: BuyNowRequest): Promise<BuyNowResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/orders/buy-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to create order');
        toast.error(result.error || 'Failed to create order');
        return null;
      }

      if (result.success) {
        toast.success('Order created successfully!');
        
        // Show additional info if coupon was applied
        if (result.coupon) {
          toast.success(`Coupon "${result.coupon.code}" applied! Saved $${result.coupon.discountApplied.toFixed(2)}`);
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      toast.error(`Failed to create order: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    buyNow,
    checkAvailability,
    isLoading,
    error,
  };
}
