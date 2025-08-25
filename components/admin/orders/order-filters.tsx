'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Calendar
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OrderFiltersProps {
  onFiltersChange: (filters: OrderFilters) => void;
  loading?: boolean;
}

export interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export function OrderFilters({ onFiltersChange }: OrderFiltersProps) {
  const [filters, setFilters] = useState<OrderFilters>({});

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PROCESSING', label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
    { value: 'COMPLETED', label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  ];

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'PAID', label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
    { value: 'FAILED', label: 'Thất bại', color: 'bg-red-100 text-red-800' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800' },
  ];

  const paymentMethodOptions = [
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
    { value: 'momo', label: 'MoMo' },
    { value: 'cash', label: 'Tiền mặt' },
  ];

  const updateFilter = (key: keyof OrderFilters, value: string | number | Date | undefined) => {
    // Clean search input
    if (key === 'search' && typeof value === 'string') {
      value = value.trim();
      if (value === '') value = undefined;
    }
    
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
  };

  const getFilterBadges = () => {
    const badges: { key: string; label: string; value: string }[] = [];
    
    if (filters.search) badges.push({ key: 'search', label: 'Tìm kiếm', value: filters.search });
    if (filters.status) {
      const status = statusOptions.find(s => s.value === filters.status);
      if (status) badges.push({ key: 'status', label: 'Trạng thái', value: status.label });
    }
    if (filters.paymentStatus) {
      const paymentStatus = paymentStatusOptions.find(s => s.value === filters.paymentStatus);
      if (paymentStatus) badges.push({ key: 'paymentStatus', label: 'Thanh toán', value: paymentStatus.label });
    }
    if (filters.paymentMethod) {
      const method = paymentMethodOptions.find(m => m.value === filters.paymentMethod);
      if (method) badges.push({ key: 'paymentMethod', label: 'Phương thức', value: method.label });
    }
    if (filters.dateFrom || filters.dateTo) {
      let dateLabel = 'Ngày';
      if (filters.dateFrom && filters.dateTo) {
        dateLabel = `${format(filters.dateFrom, 'dd/MM', { locale: vi })} - ${format(filters.dateTo, 'dd/MM', { locale: vi })}`;
      } else if (filters.dateFrom) {
        dateLabel = `Từ ${format(filters.dateFrom, 'dd/MM', { locale: vi })}`;
      } else if (filters.dateTo) {
        dateLabel = `Đến ${format(filters.dateTo, 'dd/MM', { locale: vi })}`;
      }
      badges.push({ key: 'date', label: 'Thời gian', value: dateLabel });
    }
    if (filters.minAmount || filters.maxAmount) {
      let amountLabel = 'Số tiền';
      if (filters.minAmount && filters.maxAmount) {
        amountLabel = `${filters.minAmount.toLocaleString()}-${filters.maxAmount.toLocaleString()}`;
      } else if (filters.minAmount) {
        amountLabel = `≥ ${filters.minAmount.toLocaleString()}`;
      } else if (filters.maxAmount) {
        amountLabel = `≤ ${filters.maxAmount.toLocaleString()}`;
      }
      badges.push({ key: 'amount', label: 'Số tiền', value: amountLabel });
    }

    return badges;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc đơn hàng
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nhập mã đơn hàng để tìm kiếm (VD: ORD-1755)"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Trạng thái đơn hàng</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => updateFilter('status', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-').replace('100', '600')}`} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status Filter */}
          <div className="space-y-2">
            <Label>Trạng thái thanh toán</Label>
            <Select
              value={filters.paymentStatus || 'all'}
              onValueChange={(value) => updateFilter('paymentStatus', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {paymentStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-').replace('100', '600')}`} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="space-y-2">
            <Label>Phương thức thanh toán</Label>
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) => updateFilter('paymentMethod', value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả phương thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                {paymentMethodOptions.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label>Thời gian</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.dateFrom || filters.dateTo ? (
                    <span>
                      {filters.dateFrom && format(filters.dateFrom, 'dd/MM/yyyy', { locale: vi })}
                      {filters.dateFrom && filters.dateTo && ' - '}
                      {filters.dateTo && format(filters.dateTo, 'dd/MM/yyyy', { locale: vi })}
                    </span>
                  ) : (
                    <span>Chọn khoảng thời gian</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Từ ngày</Label>
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) => updateFilter('dateFrom', date)}
                        initialFocus
                        locale={vi}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Đến ngày</Label>
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => updateFilter('dateTo', date)}
                        locale={vi}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateFilter('dateFrom', undefined);
                        updateFilter('dateTo', undefined);
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Amount Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Số tiền tối thiểu (VND)</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minAmount || ''}
              onChange={(e) => updateFilter('minAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label>Số tiền tối đa (VND)</Label>
            <Input
              type="number"
              placeholder="Không giới hạn"
              value={filters.maxAmount || ''}
              onChange={(e) => updateFilter('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Active Filters */}
        {getFilterBadges().length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Bộ lọc đang áp dụng:</span>
              {getFilterBadges().map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="text-xs">{badge.label}: {badge.value}</span>
                  <X
                    className="h-3 w-3 cursor-pointer hover:bg-muted-foreground/20 rounded"
                    onClick={() => {
                      if (badge.key === 'date') {
                        updateFilter('dateFrom', undefined);
                        updateFilter('dateTo', undefined);
                      } else if (badge.key === 'amount') {
                        updateFilter('minAmount', undefined);
                        updateFilter('maxAmount', undefined);
                      } else {
                        updateFilter(badge.key as keyof OrderFilters, undefined);
                      }
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
