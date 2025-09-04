'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ServiceActions } from './service-actions';
import { Service } from '@/hooks/use-services';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Star,
  Package,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface ServiceTableProps {
  services: Service[];
  isLoading: boolean;
  onViewService: (service: Service) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  onToggleStatus: (service: Service) => void;
  onTogglePopular: (service: Service) => void;
  onDuplicateService: (service: Service) => void;
}

interface FilterOptions {
  search: string;
  category: string;
  status: string;
  popular: string;
  sortBy: 'name' | 'created_at' | 'display_order' | 'price_from';
  sortOrder: 'asc' | 'desc';
}

export function ServiceTable({
  services,
  isLoading,
  onViewService,
  onEditService,
  onDeleteService,
  onToggleStatus,
  onTogglePopular,
  onDuplicateService
}: ServiceTableProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    status: 'all',
    popular: 'all',
    sortBy: 'display_order',
    sortOrder: 'asc'
  });

  const categories = [...new Set(services.map(service => service.category))];

  const filteredAndSortedServices = services
    .filter((service) => {
      const matchSearch = service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         service.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         service.category.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchCategory = filters.category === 'all' || service.category === filters.category;
      
      const matchStatus = filters.status === 'all' || 
                         (filters.status === 'active' && service.is_active) ||
                         (filters.status === 'inactive' && !service.is_active);
      
      const matchPopular = filters.popular === 'all' ||
                          (filters.popular === 'popular' && service.popular) ||
                          (filters.popular === 'normal' && !service.popular);
      
      return matchSearch && matchCategory && matchStatus && matchPopular;
    })
    .sort((a, b) => {
      const sortMultiplier = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'vi-VN') * sortMultiplier;
        case 'created_at':
          return (new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()) * sortMultiplier;
        case 'display_order':
          return (a.display_order - b.display_order) * sortMultiplier;
        case 'price_from':
          return (a.price_from - b.price_from) * sortMultiplier;
        default:
          return 0;
      }
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSort = (column: FilterOptions['sortBy']) => {
    if (filters.sortBy === column) {
      setFilters(prev => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        sortBy: column,
        sortOrder: 'asc'
      }));
    }
  };

  const getSortIcon = (column: FilterOptions['sortBy']) => {
    if (filters.sortBy !== column) return null;
    return filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      popular: 'all',
      sortBy: 'display_order',
      sortOrder: 'asc'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Danh sách dịch vụ ({filteredAndSortedServices.length} / {services.length})
        </CardTitle>
        
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 min-w-[300px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, mô tả, danh mục..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.popular} onValueChange={(value) => updateFilter('popular', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Nổi bật" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="popular">Nổi bật</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
            
            <Button
              variant={filters.sortBy === 'display_order' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSort('display_order')}
              className="gap-2"
            >
              Thứ tự {getSortIcon('display_order')}
            </Button>
            
            <Button
              variant={filters.sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSort('name')}
              className="gap-2"
            >
              Tên {getSortIcon('name')}
            </Button>
            
            <Button
              variant={filters.sortBy === 'price_from' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSort('price_from')}
              className="gap-2"
            >
              Giá {getSortIcon('price_from')}
            </Button>
            
            <Button
              variant={filters.sortBy === 'created_at' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSort('created_at')}
              className="gap-2"
            >
              Ngày tạo {getSortIcon('created_at')}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải danh sách dịch vụ...</p>
            </div>
          </div>
        ) : filteredAndSortedServices.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {services.length === 0 
                ? "Chưa có dịch vụ nào được tạo" 
                : "Không tìm thấy dịch vụ phù hợp với bộ lọc"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá từ</TableHead>
                  <TableHead>Tính năng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedServices.map((service, index) => (
                  <TableRow key={service.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {index + 1}
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{service.name}</span>
                          {service.popular && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Nổi bật
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                        {service.slug && (
                          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                            {service.slug}
                          </code>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {formatPrice(service.price_from)}
                      </span>
                      {service.duration && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {service.duration}
                        </p>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.features.length}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {service.is_active ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Tạm dừng
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{service.display_order}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(service.created_at || '')}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <ServiceActions
                        service={service}
                        onView={onViewService}
                        onEdit={onEditService}
                        onDelete={onDeleteService}
                        onToggleStatus={onToggleStatus}
                        onTogglePopular={onTogglePopular}
                        onDuplicate={onDuplicateService}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
