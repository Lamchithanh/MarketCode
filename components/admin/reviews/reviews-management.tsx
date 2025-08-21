'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ReviewsHeader } from './reviews-header';
import { ReviewsStats } from './reviews-stats';
import { ReviewsSearch } from './reviews-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Eye, Trash2, Database, Star, ThumbsUp } from 'lucide-react';
import { ReviewViewDialog } from './review-view-dialog';
import { ReviewEditDialog } from './review-edit-dialog';
import { ReviewDeleteDialog } from './review-delete-dialog';

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

export function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  // Load reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews based on search term
  useEffect(() => {
    const filtered = reviews.filter(review =>
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredReviews(filtered);
  }, [reviews, searchTerm]);

  const handleRefresh = async () => {
    await fetchReviews();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-stone-300'
        }`}
      />
    ));
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setIsEditDialogOpen(true);
  };

  const handleDeleteReview = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleSaveReview = (updatedReview: Review) => {
    setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
    setSelectedReview(null);
  };

  const handleConfirmDelete = (reviewToDelete: Review) => {
    setReviews(reviews.filter(r => r.id !== reviewToDelete.id));
    setSelectedReview(null);
  };

  const handleApproveReview = async (review: Review) => {
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isApproved: !review.isApproved,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review approval status');
      }

      // Update local state
      setReviews(reviews.map(r => 
        r.id === review.id ? { ...r, isApproved: !r.isApproved, updatedAt: new Date().toISOString() } : r
      ));
    } catch (error) {
      console.error('Error updating review approval:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReviewsHeader />

      {/* Refresh Info */}
      <div className="flex items-center justify-end space-x-2">
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
        <RefreshCw 
          className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`}
          onClick={handleRefresh}
        />
      </div>

      {/* Stats Cards */}
      <ReviewsStats reviews={reviews} />

      {/* Search and Filters */}
      <ReviewsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Reviews Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Reviews Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Nhận xét</TableHead>
                <TableHead>Hữu ích</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.userAvatar || undefined} alt={review.userName} />
                        <AvatarFallback className="bg-stone-100 text-stone-600">
                          {review.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{review.userName}</p>
                        <p className="text-sm text-muted-foreground">{review.userEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{review.productTitle}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({review.rating})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {review.comment || 'Không có nhận xét'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-3 w-3 text-stone-600" />
                      <span className="text-sm font-medium">{review.isHelpful}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={review.isApproved ? 'default' : 'secondary'}
                      className={review.isApproved ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}
                    >
                      {review.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewReview(review)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleApproveReview(review)}>
                          <Star className="mr-2 h-4 w-4" />
                          {review.isApproved ? 'Bỏ duyệt' : 'Duyệt'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditReview(review)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteReview(review)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Review Dialog */}
      <ReviewViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        review={selectedReview}
      />

      {/* Edit Review Dialog */}
      <ReviewEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        review={selectedReview}
        onSave={handleSaveReview}
      />

      {/* Delete Review Dialog */}
      <ReviewDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        review={selectedReview}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
