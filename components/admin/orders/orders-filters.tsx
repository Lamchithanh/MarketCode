'use client';

import { useState } from 'react';
import { Calendar, Filter, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  buyerId?: string;
}

interface OrdersFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

export function OrdersFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  loading = false 
}: OrdersFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  const handleFilterChange = (key: keyof OrderFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined };
    onFiltersChange(newFilters);
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    handleFilterChange('dateFrom', date ? date.toISOString() : undefined);
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    handleFilterChange('dateTo', date ? date.toISOString() : undefined);
  };

  const handleReset = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    onReset();
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  return (
    <div className="flex items-center gap-2">
      {/* Quick search */}
      <div className="relative flex-1 max-w-sm">
        <Input
          placeholder="Tìm theo mã đơn hàng, tên khách hàng..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pr-8"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-6 w-6 p-0"
            onClick={() => handleFilterChange('search', '')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Quick status filter */}
      <Select 
        value={filters.status || 'all'} 
        onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="PENDING">Chờ xử lý</SelectItem>
          <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
          <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
          <SelectItem value="CANCELLED">Đã hủy</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced filters sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-1" />
            Lọc
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[350px] overflow-y-auto">
          <SheetHeader className="pb-6 px-6 pt-6">
            <SheetTitle>Bộ lọc</SheetTitle>
          </SheetHeader>

          <div className="px-6 space-y-6">
            {/* Status filters */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Trạng thái đơn hàng</Label>
                <Select 
                  value={filters.status || 'all'} 
                  onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                    <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                    <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Trạng thái thanh toán</Label>
                <Select 
                  value={filters.paymentStatus || 'all'} 
                  onValueChange={(value) => handleFilterChange('paymentStatus', value === 'all' ? '' : value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                    <SelectItem value="PAID">Đã thanh toán</SelectItem>
                    <SelectItem value="FAILED">Thất bại</SelectItem>
                    <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date range */}
            <div>
              <Label className="text-sm font-medium">Thời gian</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-3 w-3" />
                      {dateFrom ? format(dateFrom, "dd/MM", { locale: vi }) : "Từ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={handleDateFromChange}
                      initialFocus
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-3 w-3" />
                      {dateTo ? format(dateTo, "dd/MM", { locale: vi }) : "Đến"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={handleDateToChange}
                      initialFocus
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount range */}
            <div>
              <Label className="text-sm font-medium">Giá trị đơn hàng</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Input
                  type="number"
                  placeholder="Từ"
                  value={filters.minAmount || ''}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 mt-8 border-t bg-muted/30">
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={handleReset} disabled={loading} size="sm" className="flex-1">
                <RotateCcw className="h-3 w-3 mr-2" />
                Đặt lại
              </Button>
              <Button onClick={() => setIsOpen(false)} disabled={loading} size="sm" className="flex-1">
                Áp dụng
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Reset filters */}
      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" onClick={handleReset} disabled={loading}>
          <X className="h-4 w-4 mr-1" />
          Xóa ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
}
