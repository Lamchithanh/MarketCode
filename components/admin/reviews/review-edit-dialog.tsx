'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  productTitle: string;
  rating: number;
  comment?: string;
  isApproved: boolean;
}

interface ReviewEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onSave: (updatedReview: Review) => void;
}

export function ReviewEditDialog({ open, onOpenChange, review, onSave }: ReviewEditDialogProps) {
  if (!review) return null;

  const handleSave = () => {
    // In a real app, you would collect form data here
    onSave(review);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update review information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userName">User Name</Label>
              <Input 
                id="userName"
                defaultValue={review.userName}
                className="mt-1"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="userEmail">User Email</Label>
              <Input 
                id="userEmail"
                defaultValue={review.userEmail}
                className="mt-1"
                disabled
              />
            </div>
          </div>
          <div>
            <Label htmlFor="productTitle">Product</Label>
            <Input 
              id="productTitle"
              defaultValue={review.productTitle}
              className="mt-1"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Select defaultValue={review.rating.toString()}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="comment">Comment</Label>
            <Textarea 
              id="comment"
              defaultValue={review.comment || ''}
              className="mt-1"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={review.isApproved ? 'approved' : 'pending'}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
