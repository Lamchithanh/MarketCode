'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GitCodeStatsProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function GitCodeStats({ total, pending, approved, rejected }: GitCodeStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê GitCode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Tổng cộng</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <div className="text-sm text-gray-500">Chờ duyệt</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{approved}</div>
            <div className="text-sm text-gray-500">Đã duyệt</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{rejected}</div>
            <div className="text-sm text-gray-500">Bị từ chối</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
