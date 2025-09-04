'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Power,
  PowerOff,
  Star,
  StarOff,
  Trash2,
  Copy
} from 'lucide-react';
import { Service } from '@/hooks/use-services';

interface ServiceActionsProps {
  service: Service;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onToggleStatus: (service: Service) => void;
  onTogglePopular: (service: Service) => void;
  onDuplicate: (service: Service) => void;
  onDelete: (service: Service) => void;
  disabled?: boolean;
}

export function ServiceActions({
  service,
  onView,
  onEdit,
  onToggleStatus,
  onTogglePopular,
  onDuplicate,
  onDelete,
  disabled = false
}: ServiceActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0" 
          disabled={disabled}
        >
          <span className="sr-only">Mở menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(service)}>
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onEdit(service)}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onToggleStatus(service)}>
          {service.is_active ? (
            <>
              <PowerOff className="mr-2 h-4 w-4" />
              Tạm dừng
            </>
          ) : (
            <>
              <Power className="mr-2 h-4 w-4" />
              Kích hoạt
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onTogglePopular(service)}>
          {service.popular ? (
            <>
              <StarOff className="mr-2 h-4 w-4" />
              Bỏ nổi bật
            </>
          ) : (
            <>
              <Star className="mr-2 h-4 w-4" />
              Đánh dấu nổi bật
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onDuplicate(service)}>
          <Copy className="mr-2 h-4 w-4" />
          Sao chép
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(service)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa dịch vụ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
