'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ServiceRequest } from '@/hooks/use-service-requests';

interface ServiceRequestDialogsProps {
  selectedRequest: ServiceRequest | null;
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isQuoteDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isStatusDialogOpen: boolean;
  updating: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsQuoteDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsStatusDialogOpen: (open: boolean) => void;
  onUpdateStatus: (id: string, status: ServiceRequest['status'], notes?: string) => Promise<void>;
  onAddQuote: (id: string, price: number, duration: string, notes?: string) => Promise<void>;
  onConfirmDelete: () => Promise<void>;
}

export function ServiceRequestDialogs({
  selectedRequest,
  isViewDialogOpen,
  isQuoteDialogOpen,
  isDeleteDialogOpen,
  isStatusDialogOpen,
  updating,
  setIsViewDialogOpen,
  setIsQuoteDialogOpen,
  setIsDeleteDialogOpen,
  setIsStatusDialogOpen,
  onUpdateStatus,
  onAddQuote,
  onConfirmDelete
}: ServiceRequestDialogsProps) {
  // Quote dialog state
  const [quotedPrice, setQuotedPrice] = useState('');
  const [quotedDuration, setQuotedDuration] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  // Status dialog state
  const [newStatus, setNewStatus] = useState<ServiceRequest['status']>('pending');
  const [statusNotes, setStatusNotes] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddQuote = async () => {
    if (!selectedRequest || !quotedPrice || !quotedDuration) return;
    
    await onAddQuote(
      selectedRequest.id,
      parseFloat(quotedPrice),
      quotedDuration,
      quoteNotes
    );
    
    setQuotedPrice('');
    setQuotedDuration('');
    setQuoteNotes('');
    setIsQuoteDialogOpen(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    
    await onUpdateStatus(selectedRequest.id, newStatus, statusNotes);
    setStatusNotes('');
    setIsStatusDialogOpen(false);
  };

  const getStatusBadge = (status: ServiceRequest['status']) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800' },
      quoted: { label: 'Đã báo giá', color: 'bg-purple-100 text-purple-800' },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
      in_progress: { label: 'Đang thực hiện', color: 'bg-indigo-100 text-indigo-800' },
      completed: { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu dịch vụ</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu dịch vụ từ khách hàng
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Thông tin khách hàng</Label>
                  <div className="p-3 border rounded-lg space-y-1">
                    <p><strong>Tên:</strong> {selectedRequest.name}</p>
                    <p><strong>Email:</strong> {selectedRequest.email}</p>
                    {selectedRequest.phone && <p><strong>SĐT:</strong> {selectedRequest.phone}</p>}
                    {selectedRequest.company && <p><strong>Công ty:</strong> {selectedRequest.company}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-semibold">Trạng thái</Label>
                  <div className="p-3 border rounded-lg space-y-2">
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                    <p><strong>Ngày tạo:</strong> {formatDate(selectedRequest.created_at)}</p>
                    <p><strong>Cập nhật:</strong> {formatDate(selectedRequest.updated_at)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Details */}
              <div className="space-y-4">
                <Label className="font-semibold">Chi tiết dịch vụ</Label>
                <div className="p-4 border rounded-lg space-y-3">
                  <p><strong>Loại dịch vụ:</strong> {selectedRequest.service_name}</p>
                  <p><strong>Tiêu đề:</strong> {selectedRequest.title}</p>
                  <div>
                    <strong>Mô tả:</strong>
                    <p className="mt-1 p-2 bg-gray-50 rounded text-sm">
                      {selectedRequest.description}
                    </p>
                  </div>
                  {selectedRequest.budget_range && (
                    <p><strong>Ngân sách:</strong> {selectedRequest.budget_range}</p>
                  )}
                  {selectedRequest.timeline && (
                    <p><strong>Thời gian mong muốn:</strong> {selectedRequest.timeline}</p>
                  )}
                </div>
              </div>

              {/* Quote Info */}
              {selectedRequest.quoted_price && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="font-semibold">Thông tin báo giá</Label>
                    <div className="p-4 border rounded-lg bg-green-50 space-y-2">
                      <p><strong>Giá báo:</strong> {formatPrice(selectedRequest.quoted_price)}</p>
                      {selectedRequest.quoted_duration && (
                        <p><strong>Thời gian thực hiện:</strong> {selectedRequest.quoted_duration}</p>
                      )}
                      {selectedRequest.quote_notes && (
                        <div>
                          <strong>Ghi chú:</strong>
                          <p className="mt-1 p-2 bg-white rounded text-sm">
                            {selectedRequest.quote_notes}
                          </p>
                        </div>
                      )}
                      {selectedRequest.quoted_at && (
                        <p className="text-sm text-muted-foreground">
                          Báo giá lúc: {formatDate(selectedRequest.quoted_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Admin Notes */}
              {selectedRequest.admin_notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="font-semibold">Ghi chú nội bộ</Label>
                    <div className="p-3 border rounded-lg bg-blue-50">
                      {selectedRequest.admin_notes}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm báo giá</DialogTitle>
            <DialogDescription>
              Thêm thông tin báo giá cho yêu cầu dịch vụ
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá báo (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="Nhập giá báo"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian thực hiện *</Label>
              <Input
                id="duration"
                placeholder="Ví dụ: 2-3 tuần, 1 tháng"
                value={quotedDuration}
                onChange={(e) => setQuotedDuration(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú báo giá</Label>
              <Textarea
                id="notes"
                placeholder="Thêm ghi chú về báo giá..."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsQuoteDialogOpen(false)}
              disabled={updating}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleAddQuote}
              disabled={!quotedPrice || !quotedDuration || updating}
            >
              {updating ? 'Đang xử lý...' : 'Lưu báo giá'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái xử lý yêu cầu dịch vụ
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái mới *</Label>
              <Select value={newStatus} onValueChange={(value: ServiceRequest['status']) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="reviewing">Đang xem xét</SelectItem>
                  <SelectItem value="quoted">Đã báo giá</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-notes">Ghi chú cập nhật</Label>
              <Textarea
                id="status-notes"
                placeholder="Thêm ghi chú về việc thay đổi trạng thái..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={updating}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={updating}
            >
              {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa yêu cầu dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa yêu cầu dịch vụ này không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
