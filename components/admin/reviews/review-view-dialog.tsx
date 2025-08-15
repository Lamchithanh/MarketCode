'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  productTitle: string;
  productId: string;
  rating: number;
  comment?: string;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            Detailed information about the review
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={review.userAvatar} alt={review.userName} />
              <AvatarFallback className="bg-stone-100 text-stone-600">
                {review.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{review.userName}</p>
              <p className="text-sm text-muted-foreground">{review.userEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Product</label>
              <p className="text-foreground font-medium mt-1">{review.productTitle}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Rating</label>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(review.rating)}
                <span className="text-sm text-muted-foreground ml-2">({review.rating}/5)</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Comment</label>
              <div className="bg-muted p-3 rounded mt-1">
                <p className="text-foreground whitespace-pre-wrap">
                  {review.comment || 'No comment provided'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Helpful Votes</label>
              <div className="flex items-center space-x-1 mt-1">
                <ThumbsUp className="h-4 w-4 text-stone-600" />
                <span className="font-medium">{review.isHelpful}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge 
                variant={review.isApproved ? 'default' : 'secondary'}
                className={review.isApproved ? 'bg-green-100 text-green-800 mt-1' : 'bg-stone-100 text-stone-600 mt-1'}
              >
                {review.isApproved ? 'Approved' : 'Pending'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-foreground mt-1">{formatDate(review.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated</label>
              <p className="text-foreground mt-1">{formatDate(review.updatedAt)}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
