'use client';

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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ServiceForm } from './service-form';
import { Service } from '@/hooks/use-services';
import { CheckCircle, XCircle, Star, Eye, Package } from 'lucide-react';

interface ServiceDialogsProps {
  selectedService: Service | null;
  isViewDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  totalServices: number;
  setIsViewDialogOpen: (open: boolean) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  onCreateService: (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateService: (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onConfirmDelete: () => Promise<void>;
}

export function ServiceDialogs({
  selectedService,
  isViewDialogOpen,
  isCreateDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isLoading,
  totalServices,
  setIsViewDialogOpen,
  setIsCreateDialogOpen,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  onCreateService,
  onUpdateService,
  onConfirmDelete
}: ServiceDialogsProps) {

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCreateSubmit = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    await onCreateService(serviceData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateSubmit = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    await onUpdateService(serviceData);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Chi tiết dịch vụ
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về dịch vụ trong hệ thống
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Thông tin cơ bản</h4>
                  <div className="p-3 border rounded-lg space-y-2">
                    <p><strong>Tên:</strong> {selectedService.name}</p>
                    <p><strong>Slug:</strong> <code className="text-sm bg-gray-100 px-1 rounded">{selectedService.slug}</code></p>
                    <p><strong>Danh mục:</strong> <Badge variant="outline">{selectedService.category}</Badge></p>
                    <p><strong>Icon:</strong> {selectedService.icon_name}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Trạng thái & Thứ tự</h4>
                  <div className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <strong>Trạng thái:</strong>
                      {selectedService.is_active ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Tạm dừng
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>Nổi bật:</strong>
                      {selectedService.popular ? (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Nổi bật
                        </Badge>
                      ) : (
                        <Badge variant="outline">Bình thường</Badge>
                      )}
                    </div>
                    <p><strong>Thứ tự:</strong> {selectedService.display_order}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Giá & Thời gian</h4>
                  <div className="p-3 border rounded-lg space-y-2">
                    <p><strong>Giá từ:</strong> <span className="text-green-600 font-semibold">{formatPrice(selectedService.price_from)}</span></p>
                    <p><strong>Thời gian:</strong> {selectedService.duration || 'Chưa xác định'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Thời gian</h4>
                  <div className="p-3 border rounded-lg space-y-2">
                    <p><strong>Tạo:</strong> {formatDate(selectedService.created_at)}</p>
                    <p><strong>Cập nhật:</strong> {formatDate(selectedService.updated_at)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-semibold">Mô tả dịch vụ</h4>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="whitespace-pre-wrap">{selectedService.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Tính năng ({selectedService.features.length})
                </h4>
                <div className="p-4 border rounded-lg">
                  {selectedService.features.length > 0 ? (
                    <div className="space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Chưa có tính năng nào được thêm</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo dịch vụ mới</DialogTitle>
            <DialogDescription>
              Thêm dịch vụ mới vào hệ thống của bạn
            </DialogDescription>
          </DialogHeader>
          
          <ServiceForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
            loading={isLoading}
            totalServices={totalServices}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dịch vụ
            </DialogDescription>
          </DialogHeader>
          
          <ServiceForm
            service={selectedService}
            onSubmit={handleUpdateSubmit}
            onCancel={() => setIsEditDialogOpen(false)}
            loading={isLoading}
            totalServices={totalServices}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa dịch vụ &ldquo;{selectedService?.name}&rdquo; không? 
              Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các yêu cầu dịch vụ liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
