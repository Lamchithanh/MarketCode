'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw, Settings } from 'lucide-react';
import { useServiceRequests, ServiceRequest } from '@/hooks/use-service-requests';
import { ServiceRequestStatsCards } from './service-request-stats-cards';
import { ServiceRequestActions } from './service-request-actions';
import { ServiceRequestDialogs } from './service-request-dialogs';

export function ServiceRequestTable() {
  const {
    requests,
    loading,
    updating,
    statistics,
    addQuote,
    refresh
  } = useServiceRequests();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);

  const filteredRequests = searchTerm 
    ? requests.filter(request => 
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : requests;

  const handleRefresh = async () => {
    await refresh();
  };

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleAddQuote = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsQuoteDialogOpen(true);
  };

  // Helper functions

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
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

  const getPriorityBadge = (priority: ServiceRequest['priority']) => {
    const priorityConfig = {
      low: { label: 'Thấp', color: 'bg-gray-100 text-gray-800' },
      medium: { label: 'Trung bình', color: 'bg-blue-100 text-blue-800' },
      high: { label: 'Cao', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority];
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý yêu cầu dịch vụ</h2>
          <p className="text-muted-foreground">Quản lý và xử lý các yêu cầu dịch vụ từ khách hàng</p>
        </div>
        <div className="flex items-center space-x-2">
          <div title="Làm mới dữ liệu">
            <RefreshCw 
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`} 
              onClick={handleRefresh} 
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <ServiceRequestStatsCards stats={statistics} />

      {/* Search & Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Tìm kiếm yêu cầu dịch vụ..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10" 
              />
            </div>
            {/* Removed "Add New Request" button - service requests come from customers only */}
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Danh sách yêu cầu dịch vụ ({statistics.total} tổng cộng)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Yêu cầu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Báo giá</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{request.name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          {request.company && (
                            <p className="text-xs text-muted-foreground">{request.company}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{request.service_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {request.service_type.replace('-', ' ')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{request.title}</p>
                          <p className="text-sm text-muted-foreground max-w-xs truncate">
                            {request.description}
                          </p>
                          {request.budget_range && (
                            <p className="text-xs text-muted-foreground">
                              Ngân sách: {request.budget_range}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell>
                        {request.quoted_price ? (
                          <div>
                            <p className="font-medium text-green-600">
                              {formatPrice(request.quoted_price)}
                            </p>
                            {request.quoted_duration && (
                              <p className="text-xs text-muted-foreground">
                                {request.quoted_duration}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Chưa báo giá</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(request.created_at)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <ServiceRequestActions
                          request={request}
                          onView={handleViewRequest}
                          onAddQuote={handleAddQuote}
                          disabled={updating}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'Không tìm thấy yêu cầu dịch vụ nào phù hợp với tìm kiếm của bạn.' : 'Không tìm thấy yêu cầu dịch vụ nào.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs - Only View and Quote dialogs needed */}
      <ServiceRequestDialogs
        selectedRequest={selectedRequest}
        isViewDialogOpen={isViewDialogOpen}
        isQuoteDialogOpen={isQuoteDialogOpen}
        updating={updating}
        setIsViewDialogOpen={setIsViewDialogOpen}
        setIsQuoteDialogOpen={setIsQuoteDialogOpen}
        onAddQuote={addQuote}
      />
    </div>
  );
}
