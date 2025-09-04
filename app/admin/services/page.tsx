'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useServices, Service } from '@/hooks/use-services';
import { ServiceStatsCards } from '@/components/admin/services/service-stats-cards';
import { ServiceTable } from '@/components/admin/services/service-table';
import { ServiceDialogs } from '@/components/admin/services/service-dialogs';

export default function ServicesManagementPage() {
  const {
    services,
    stats,
    loading,
    createService,
    updateService,
    deleteService
  } = useServices();

  console.log('🖥️ Services Management Page - services:', services.length, 'statistics:', stats);

  // Dialog states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Action handlers
  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      const updatedService = {
        ...service,
        is_active: !service.is_active,
        // Remove readonly fields
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      } as Omit<Service, 'id' | 'created_at' | 'updated_at'>;
      
      await updateService(service.id, updatedService);
      toast.success(`Đã ${!service.is_active ? 'kích hoạt' : 'tạm dừng'} dịch vụ ${service.name}`);
    } catch {
      toast.error('Không thể cập nhật trạng thái dịch vụ');
    }
  };

  const handleTogglePopular = async (service: Service) => {
    try {
      const updatedService = {
        ...service,
        popular: !service.popular,
        // Remove readonly fields
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      } as Omit<Service, 'id' | 'created_at' | 'updated_at'>;
      
      await updateService(service.id, updatedService);
      toast.success(`Đã ${!service.popular ? 'đánh dấu nổi bật' : 'bỏ đánh dấu nổi bật'} dịch vụ ${service.name}`);
    } catch {
      toast.error('Không thể cập nhật trạng thái nổi bật');
    }
  };

  const handleDuplicateService = async (service: Service) => {
    try {
      const duplicatedService = {
        name: `${service.name} - Copy`,
        slug: `${service.slug}-copy`,
        description: service.description,
        price_text: service.price_text,
        category: service.category,
        service_type: service.service_type,
        icon_name: service.icon_name,
        price_from: service.price_from,
        duration: service.duration,
        features: [...service.features],
        popular: false, // Reset popular status for duplicated service
        is_active: true,   // Set as active by default
        display_order: services.length > 0 ? Math.max(...services.map(s => s.display_order)) + 1 : 1
      };
      
      await createService(duplicatedService);
      toast.success(`Đã sao chép dịch vụ ${service.name}`);
    } catch {
      toast.error('Không thể sao chép dịch vụ');
    }
  };

  // Form handlers
  const handleCreateService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createService(serviceData);
      toast.success('Đã tạo dịch vụ mới thành công');
    } catch {
      toast.error('Không thể tạo dịch vụ mới');
      throw new Error('Failed to create service'); // Re-throw to prevent dialog from closing
    }
  };

  const handleUpdateService = async (serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedService) return;
    
    try {
      await updateService(selectedService.id, serviceData);
      toast.success('Đã cập nhật dịch vụ thành công');
    } catch {
      toast.error('Không thể cập nhật dịch vụ');
      throw new Error('Failed to update service'); // Re-throw to prevent dialog from closing
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService) return;
    
    try {
      await deleteService(selectedService.id);
      toast.success(`Đã xóa dịch vụ ${selectedService.name}`);
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    } catch {
      toast.error('Không thể xóa dịch vụ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý dịch vụ</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả các dịch vụ trong hệ thống của bạn
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo dịch vụ mới
        </Button>
      </div>

      {/* Stats Cards */}
      <ServiceStatsCards stats={{
        total: stats?.total || 0,
        active: stats?.active || 0,
        inactive: stats?.inactive || 0,
        popular: stats?.popular || 0,
        categories: { [services.length > 0 ? services[0]?.category || 'default' : 'default']: stats?.categories || 0 },
        this_week: services.filter(s => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return s.created_at ? new Date(s.created_at) > weekAgo : false;
        }).length
      }} />

      {/* Services Table */}
      <ServiceTable
        services={services}
        isLoading={loading}
        onViewService={handleViewService}
        onEditService={handleEditService}
        onDeleteService={handleDeleteService}
        onToggleStatus={handleToggleStatus}
        onTogglePopular={handleTogglePopular}
        onDuplicateService={handleDuplicateService}
      />

      {/* Dialogs */}
      <ServiceDialogs
        selectedService={selectedService}
        isViewDialogOpen={isViewDialogOpen}
        isCreateDialogOpen={isCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isLoading={loading}
        totalServices={stats.total}
        setIsViewDialogOpen={setIsViewDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onCreateService={handleCreateService}
        onUpdateService={handleUpdateService}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
