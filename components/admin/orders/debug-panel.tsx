'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DebugPanelProps {
  orderId?: string;
}

export function DebugPanel({ orderId }: DebugPanelProps) {
  const [loading, setLoading] = useState(false);

  const testQuickUpdate = async (status: string) => {
    if (!orderId) {
      toast.error('Không có order ID');
      return;
    }

    try {
      setLoading(true);
      console.log('Quick test update:', { orderId, status });

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      const result = await response.json();
      console.log('Quick test result:', result);
      toast.success(`✅ Update thành công: ${status}`);
      
      // Refresh page after 1 second
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (error) {
      console.error('Quick test error:', error);
      toast.error(`❌ Lỗi: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 z-50">
      <div className="text-sm font-medium mb-2">🐛 Debug Panel</div>
      <div className="text-xs text-gray-500 mb-2">Order: {orderId.slice(0, 8)}...</div>
      <div className="flex space-x-1">
        <Button size="sm" onClick={() => testQuickUpdate('PENDING')} disabled={loading}>
          P
        </Button>
        <Button size="sm" onClick={() => testQuickUpdate('PROCESSING')} disabled={loading}>
          Pr
        </Button>
        <Button size="sm" onClick={() => testQuickUpdate('COMPLETED')} disabled={loading}>
          C
        </Button>
        <Button size="sm" onClick={() => testQuickUpdate('CANCELLED')} disabled={loading}>
          X
        </Button>
      </div>
    </div>
  );
}
