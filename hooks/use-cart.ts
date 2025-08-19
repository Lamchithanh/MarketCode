import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  technologies: string[];
  category: string;
  description: string;
  rating: number;
  features: string[];
  cartId: string;
  addedAt: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart');
      const result = await response.json();
      
      if (result.success) {
        setItems(result.items || []);
      } else {
        throw new Error(result.error || 'Failed to fetch cart items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addItem = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh cart items
        await fetchCartItems();
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to add item to cart');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error adding item to cart:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Remove item from cart
  const removeItem = async (cartId: string) => {
    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state immediately for better UX
        setItems(prev => prev.filter(item => item.cartId !== cartId));
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to remove item from cart');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error removing item from cart:', err);
      // Refresh cart items to ensure sync
      await fetchCartItems();
      return { success: false, error: errorMessage };
    }
  };

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;

  useEffect(() => {
    fetchCartItems();
  }, []);

  return {
    items,
    loading,
    error,
    subtotal,
    itemCount,
    addItem,
    removeItem,
    refreshCart: fetchCartItems
  };
}
