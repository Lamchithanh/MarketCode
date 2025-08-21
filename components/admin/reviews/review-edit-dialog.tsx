'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Save, X } from "lucide-react";

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

interface ReviewEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onSave: (updatedReview: Review) => void;
}

export function ReviewEditDialog({ open, onOpenChange, review, onSave }: ReviewEditDialogProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment || '');
      setIsApproved(review.isApproved);
    }
  }, [review]);

  if (!review) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
          isApproved,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      // Create updated review object
      const updatedReview: Review = {
        ...review,
        rating,
        comment: comment.trim() || null,
        isApproved,
        updatedAt: new Date().toISOString(),
      };

      onSave(updatedReview);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating review:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const renderStarSelector = () => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-6 w-6 cursor-pointer transition-colors ${
              index < rating 
                ? 'text-yellow-400 fill-current hover:text-yellow-500' 
                : 'text-stone-300 hover:text-yellow-300'
            }`}
            onClick={() => setRating(index + 1)}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Chỉnh sửa đánh giá</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info (Read-only) */}
          <div className="flex items-center space-x-4 p-4 bg-stone-50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={review.userAvatar || undefined} alt={review.userName} />
              <AvatarFallback className="bg-stone-200 text-stone-600">
                {review.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">{review.userName}</h3>
              <p className="text-sm text-muted-foreground">{review.userEmail}</p>
              <p className="text-sm text-muted-foreground">Sản phẩm: {review.productTitle}</p>
            </div>
          </div>

          {/* Approval Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Trạng thái duyệt</label>
            <Select value={isApproved.toString()} onValueChange={(value) => setIsApproved(value === 'true')}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="false">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-stone-100 text-stone-600">Chờ duyệt</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Đánh giá</label>
            {renderStarSelector()}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nhận xét</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập nhận xét..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}