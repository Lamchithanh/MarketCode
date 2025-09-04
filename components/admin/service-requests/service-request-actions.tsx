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
  DollarSign, 
  RotateCcw, 
  Trash2 
} from 'lucide-react';
import { ServiceRequest } from '@/hooks/use-service-requests';

interface ServiceRequestActionsProps {
  request: ServiceRequest;
  onView: (request: ServiceRequest) => void;
  onEdit: (request: ServiceRequest) => void;
  onAddQuote: (request: ServiceRequest) => void;
  onChangeStatus: (request: ServiceRequest) => void;
  onDelete: (request: ServiceRequest) => void;
  disabled?: boolean;
}

export function ServiceRequestActions({
  request,
  onView,
  onEdit,
  onAddQuote,
  onChangeStatus,
  onDelete,
  disabled = false
}: ServiceRequestActionsProps) {
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
        <DropdownMenuItem onClick={() => onView(request)}>
          <Eye className="mr-2 h-4 w-4" />
          Xem chi tiết
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onEdit(request)}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {!request.quoted_price && request.status !== 'cancelled' && (
          <DropdownMenuItem onClick={() => onAddQuote(request)}>
            <DollarSign className="mr-2 h-4 w-4" />
            Thêm báo giá
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => onChangeStatus(request)}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Đổi trạng thái
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(request)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa yêu cầu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
