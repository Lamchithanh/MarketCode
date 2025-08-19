"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Server, 
  Wifi, 
  HardDrive, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface SystemStatus {
  database: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  memory: number;
  uptime: string;
}

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    database: 'healthy',
    storage: 'healthy',
    api: 'healthy',
    memory: 0,
    uptime: '0d 0h 0m'
  });
  const [loading, setLoading] = useState(true);

  const fetchSystemStatus = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with real system status
      setStatus({
        database: 'healthy',
        storage: 'healthy',
        api: 'healthy',
        memory: 75.2,
        uptime: '7d 14h 23m'
      });
    } catch (error) {
      console.error('Error fetching system status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return 'Hoạt động tốt';
      case 'warning': return 'Cảnh báo';
      case 'error': return 'Lỗi';
    }
  };

  const services = [
    {
      name: 'Database',
      icon: Database,
      status: status.database,
      description: 'Kết nối cơ sở dữ liệu'
    },
    {
      name: 'Storage',
      icon: HardDrive,
      status: status.storage,
      description: 'Hệ thống lưu trữ'
    },
    {
      name: 'API',
      icon: Wifi,
      status: status.api,
      description: 'Dịch vụ API'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Tổng quan hệ thống
          </CardTitle>
          <CardDescription>
            Trạng thái hoạt động hiện tại của hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Thời gian hoạt động</span>
            <Badge variant="outline">{status.uptime}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sử dụng bộ nhớ</span>
            <Badge variant="outline">{status.memory.toFixed(1)}%</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cập nhật lần cuối</span>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString('vi-VN')}
            </span>
          </div>

          <Button
            onClick={fetchSystemStatus}
            disabled={loading}
            size="sm"
            variant="outline"
            className="w-full"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Làm mới
          </Button>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="h-5 w-5 mr-2" />
            Trạng thái dịch vụ
          </CardTitle>
          <CardDescription>
            Tình trạng các dịch vụ cốt lõi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <service.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(service.status)}
                <Badge className={getStatusColor(service.status)}>
                  {getStatusText(service.status)}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
