'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, AlertTriangle } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  userAvatar?: string | null;
  productTitle: string;
  productId: string;
  rating: number;
  comment?: string | null;
  isHelpful: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onConfirm: (review: Review) => void;
}

export function ReviewDeleteDialog({ open, onOpenChange, review, onConfirm }: ReviewDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!review) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      onConfirm(review);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting review:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Xác nhận xóa đánh giá</span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
              </p>
              
              {/* Review Preview */}
              <div className="border rounded-lg p-4 bg-stone-50">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.userAvatar || undefined} alt={review.userName} />
                    <AvatarFallback className="bg-stone-200 text-stone-600">
                      {review.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{review.userName}</p>
                    <p className="text-sm text-muted-foreground">{review.userEmail}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge 
                      variant={review.isApproved ? 'default' : 'secondary'}
                      className={review.isApproved ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}
                    >
                      {review.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Sản phẩm:</strong> {review.productTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Đánh giá:</strong> {review.rating}/5 ⭐
                  </p>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Nhận xét:</strong> "{review.comment}"
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    <strong>Hữu ích:</strong> {review.isHelpful} người thấy hữu ích
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Đang xóa...' : 'Xóa đánh giá'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}