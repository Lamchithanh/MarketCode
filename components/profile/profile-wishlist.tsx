'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Package, Trash2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useUser } from '@/hooks/use-user';
import { toast } from "sonner";
import Image from "next/image";

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
}

export function ProfileWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const { user, isLoading: authLoading } = useUser();

  const fetchWishlist = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/wishlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const result = await response.json();
      if (result.success) {
        setItems(result.data || []);
      } else {
        setError(result.error || 'Failed to load wishlist');
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const removeFromWishlist = useCallback(async (itemId: string) => {
    if (!user?.id) return;
    
    try {
      setRemovingItems(prev => new Set(prev).add(itemId));
      
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wishlistId: itemId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const result = await response.json();
      if (result.success) {
        setItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        throw new Error(result.error || 'Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Không thể xóa sản phẩm');
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchWishlist();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, fetchWishlist]);

  // Use real data only - no fallback items
  const displayItems = items;

  // Loading state
  if (authLoading || loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Danh sách yêu thích</CardTitle>
          <CardDescription>Các sản phẩm bạn quan tâm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Package className="h-6 w-6 animate-spin" />
            <span className="ml-2">Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Danh sách yêu thích</CardTitle>
          <CardDescription>Các sản phẩm bạn quan tâm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchWishlist} variant="outline">
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Danh sách yêu thích</CardTitle>
        <CardDescription>
          Các sản phẩm bạn quan tâm
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Danh sách yêu thích trống</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {displayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-2">{item.title}</h4>
                  <p className="text-lg font-bold text-primary">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Mua ngay
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={removingItems.has(item.id)}
                  >
                    {removingItems.has(item.id) ? (
                      <Package className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 