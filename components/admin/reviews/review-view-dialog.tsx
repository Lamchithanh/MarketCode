'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, ThumbsUp, Calendar, User, Package } from "lucide-react";

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

interface ReviewViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
}

export function ReviewViewDialog({ open, onOpenChange, review }: ReviewViewDialogProps) {
  if (!review) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-stone-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Chi tiết đánh giá</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={review.userAvatar || undefined} alt={review.userName} />
              <AvatarFallback className="bg-stone-100 text-stone-600 text-lg">
                {review.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{review.userName}</h3>
              <p className="text-sm text-muted-foreground">{review.userEmail}</p>
              <Badge 
                variant={review.isApproved ? 'default' : 'secondary'}
                className={review.isApproved ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}
              >
                {review.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Product Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Sản phẩm</span>
            </div>
            <p className="text-lg font-medium text-foreground">{review.productTitle}</p>
          </div>

          <Separator />

          {/* Rating */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Đánh giá</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-2xl font-bold text-foreground">{review.rating}/5</span>
            </div>
          </div>

          <Separator />

          {/* Comment */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Nhận xét</span>
            </div>
            <div className="bg-stone-50 rounded-lg p-4">
              <p className="text-foreground leading-relaxed">
                {review.comment || 'Không có nhận xét'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Helpful Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {review.isHelpful} người thấy hữu ích
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Tạo lúc: {formatDate(review.createdAt)}</span>
            </div>
          </div>

          {review.updatedAt !== review.createdAt && (
            <div className="text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 inline mr-2" />
              Cập nhật lúc: {formatDate(review.updatedAt)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}