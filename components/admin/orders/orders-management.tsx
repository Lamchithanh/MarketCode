'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { OrdersHeader } from './orders-header';
import { OrdersStats } from './orders-stats';
import { OrdersSearch } from './orders-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Eye, Trash2, Database } from 'lucide-react';
import { OrderViewDialog } from './order-view-dialog';
import { OrderFormDialog } from './order-form-dialog';
import { OrderDeleteDialog } from './order-delete-dialog';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  itemCount: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'COMPLETED',
    totalAmount: 29.99,
    paymentStatus: 'PAID',
    createdAt: '2024-01-15T10:30:00Z',
    itemCount: 1,
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'PROCESSING',
    totalAmount: 59.98,
    paymentStatus: 'PAID',
    createdAt: '2024-01-15T11:45:00Z',
    itemCount: 2,
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    status: 'PENDING',
    totalAmount: 19.99,
    paymentStatus: 'PENDING',
    createdAt: '2024-01-15T12:20:00Z',
    itemCount: 1,
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customerName: 'Alice Wilson',
    customerEmail: 'alice@example.com',
    status: 'CANCELLED',
    totalAmount: 39.99,
    paymentStatus: 'REFUNDED',
    createdAt: '2024-01-15T13:15:00Z',
    itemCount: 1,
  },
];

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter orders based on search term
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [orders, searchTerm]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, label: 'Pending', className: '' },
      PROCESSING: { variant: 'default' as const, label: 'Processing', className: '' },
      COMPLETED: { variant: 'default' as const, label: 'Completed', className: 'bg-green-100 text-green-800' },
      CANCELLED: { variant: 'destructive' as const, label: 'Cancelled', className: '' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, label: 'Pending', className: '' },
      PAID: { variant: 'default' as const, label: 'Paid', className: 'bg-green-100 text-green-800' },
      FAILED: { variant: 'destructive' as const, label: 'Failed', className: '' },
      REFUNDED: { variant: 'secondary' as const, label: 'Refunded', className: '' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleAddOrder = () => {
    setSelectedOrder(null); // null = Add mode
    setIsFormDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order); // order = Edit mode
    setIsFormDialogOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleSaveOrder = (orderData: any) => {
    if (orderData.id) {
      // Edit mode - update existing order
      setOrders(orders.map(o => o.id === orderData.id ? { ...o, ...orderData } : o));
    } else {
      // Add mode - create new order
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        productTitle: orderData.productTitle,
        amount: orderData.amount,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        paymentMethod: orderData.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }
    setSelectedOrder(null);
  };

  const handleConfirmDelete = (orderToDelete: Order) => {
    setOrders(orders.filter(o => o.id !== orderToDelete.id));
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <OrdersHeader onAddOrder={handleAddOrder} />

      {/* Refresh Info */}
      <div className="flex items-center justify-end space-x-2">
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
        <RefreshCw 
          className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-muted-foreground cursor-pointer hover:text-foreground`}
          onClick={handleRefresh}
        />
      </div>

      {/* Stats Cards */}
      <OrdersStats orders={orders} />

      {/* Search and Filters */}
      <OrdersSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Orders Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Orders Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.itemCount} item(s)</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteOrder(order)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <OrderViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        order={selectedOrder}
      />

      {/* Order Form Dialog (Add/Edit) */}
      <OrderFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />

      {/* Delete Order Dialog */}
      <OrderDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        order={selectedOrder}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
