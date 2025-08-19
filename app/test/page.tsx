'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean; data?: unknown; error?: string} | null>(null);

  const testAPI = async (endpoint: string, method: 'GET' | 'POST' | 'PATCH' = 'GET', body?: unknown) => {
    try {
      setLoading(true);
      setResult(null);

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`API Error: ${data.error || 'Unknown error'}`);
      }

      setResult({ success: true, data });
      toast.success(`${method} ${endpoint} thành công!`);
      console.log('API Result:', data);
    } catch (error) {
      console.error('API Test Error:', error);
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast.error(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = () => testAPI('/api/test');
  
  const testGetOrders = () => testAPI('/api/admin/orders');
  
  const testGetOrderStats = () => testAPI('/api/admin/orders/stats');
  
  const testCreateOrder = () => testAPI('/api/admin/orders', 'POST', {
    buyerId: '00000000-0000-0000-0000-000000000001', // Valid UUID format
    totalAmount: 100000,
    paymentMethod: 'CREDIT_CARD',
    notes: 'Test order from debug page',
    items: [
      {
        productId: '00000000-0000-0000-0000-000000000002', // Valid UUID format
        productTitle: 'Test Product',
        productPrice: 100000
      }
    ]
  });

  const testUpdateOrder = async () => {
    // First get an order ID
    try {
      const response = await fetch('/api/admin/orders?limit=1');
      const data = await response.json();
      
      if (data.orders && data.orders.length > 0) {
        const orderId = data.orders[0].id;
        testAPI(`/api/admin/orders/${orderId}`, 'PATCH', {
          status: 'PROCESSING',
          notes: 'Updated by test page'
        });
      } else {
        toast.error('Không có order nào để test update');
      }
    } catch (error: unknown) {
      console.error('Error getting order for test:', error);
      toast.error('Lỗi khi lấy order để test update');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Debug & Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Button 
          onClick={testSupabaseConnection}
          disabled={loading}
          variant="outline"
        >
          Test Supabase Connection
        </Button>
        
        <Button 
          onClick={testGetOrders}
          disabled={loading}
          variant="outline"
        >
          Test Get Orders
        </Button>
        
        <Button 
          onClick={testGetOrderStats}
          disabled={loading}
          variant="outline"
        >
          Test Get Stats
        </Button>
        
        <Button 
          onClick={testCreateOrder}
          disabled={loading}
          variant="outline"
        >
          Test Create Order
        </Button>
        
        <Button 
          onClick={testUpdateOrder}
          disabled={loading}
          variant="outline"
        >
          Test Update Order
        </Button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>Đang test API...</p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Kết quả:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
