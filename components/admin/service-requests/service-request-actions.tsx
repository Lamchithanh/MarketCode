'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  DollarSign 
} from 'lucide-react';
import { ServiceRequest } from '@/hooks/use-service-requests';

interface ServiceRequestActionsProps {
  request: ServiceRequest;
  onView: (request: ServiceRequest) => void;
  onAddQuote: (request: ServiceRequest) => void;
  disabled?: boolean;
}

export function ServiceRequestActions({
  request,
  onView,
  onAddQuote,
  disabled = false
}: ServiceRequestActionsProps) {
  // Chỉ cho phép báo giá khi chưa có báo giá và trạng thái không phải cancelled/completed/quoted
  const canQuote = !request.quoted_price && 
    request.status !== 'cancelled' && 
    request.status !== 'completed' &&
    request.status !== 'quoted';

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
        
        {canQuote && (
          <DropdownMenuItem onClick={() => onAddQuote(request)}>
            <DollarSign className="mr-2 h-4 w-4" />
            Gửi báo giá
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
