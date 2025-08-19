'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Order } from '@/lib/services/order-service';

export default function TestOrderUpdate() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders?limit=5');
      const data = await response.json();
      
      if (data.orders) {
        setOrders(data.orders);
        console.log('Loaded orders:', data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    }
  };

  const testUpdateStatus = async (status: string) => {
    if (!selectedOrderId) {
      toast.error('Vui lòng chọn đơn hàng');
      return;
    }

    try {
      setLoading(true);
      console.log('Testing update status:', { orderId: selectedOrderId, status });

      const response = await fetch(`/api/admin/orders/${selectedOrderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update order');
      }

      console.log('Update result:', result);
      toast.success(`Đã cập nhật trạng thái thành ${status}`);
      
      // Reload orders
      await loadOrders();
      
    } catch (error) {
      console.error('Update error:', error);
      toast.error(`Lỗi cập nhật: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Order Update</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Chọn đơn hàng:</label>
          <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn đơn hàng để test" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id}>
                  {order.orderNumber} - {order.status} - {order.buyerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOrder && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Đơn hàng hiện tại:</h3>
            <p><strong>Mã đơn:</strong> {selectedOrder.orderNumber}</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <p><strong>Thanh toán:</strong> {selectedOrder.paymentStatus}</p>
            <p><strong>Khách hàng:</strong> {selectedOrder.buyerName}</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            onClick={() => testUpdateStatus('PENDING')}
            disabled={loading}
            variant="outline"
          >
            Set PENDING
          </Button>
          
          <Button 
            onClick={() => testUpdateStatus('PROCESSING')}
            disabled={loading}
            variant="outline"
          >
            Set PROCESSING
          </Button>
          
          <Button 
            onClick={() => testUpdateStatus('COMPLETED')}
            disabled={loading}
            variant="outline"
          >
            Set COMPLETED
          </Button>
          
          <Button 
            onClick={() => testUpdateStatus('CANCELLED')}
            disabled={loading}
            variant="outline"
          >
            Set CANCELLED
          </Button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <p>Đang cập nhật...</p>
          </div>
        )}
      </div>
    </div>
  );
}
