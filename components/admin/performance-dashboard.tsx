'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Zap, 
  TrendingUp, 
  Activity, 
  RefreshCw,
  BarChart3,
  HardDrive,
  Clock
} from 'lucide-react';

interface DatabaseStats {
  tableSizes: Array<{
    table_name: string;
    table_size: string;
    index_size: string;
    total_size: string;
  }>;
  cacheStats: {
    product: { size: number; max: number; hits: number; misses: number; hitRate: number };
    user: { size: number; max: number; hits: number; misses: number; hitRate: number };
    category: { size: number; max: number; hits: number; misses: number; hitRate: number };
    order: { size: number; max: number; hits: number; misses: number; hitRate: number };
  };
  timestamp: string;
}

export function PerformanceDashboard() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // This would call your optimized database service
      // For now, we'll simulate the data
      const mockStats: DatabaseStats = {
        tableSizes: [
          { table_name: 'public.User', table_size: '80 kB', index_size: '24 kB', total_size: '104 kB' },
          { table_name: 'public.Product', table_size: '56 kB', index_size: '32 kB', total_size: '88 kB' },
          { table_name: 'public.Category', table_size: '64 kB', index_size: '16 kB', total_size: '80 kB' },
          { table_name: 'public.Order', table_size: '40 kB', index_size: '24 kB', total_size: '64 kB' },
        ],
        cacheStats: {
          product: { size: 45, max: 200, hits: 1250, misses: 150, hitRate: 0.89 },
          user: { size: 23, max: 100, hits: 890, misses: 67, hitRate: 0.93 },
          category: { size: 12, max: 50, hits: 456, misses: 12, hitRate: 0.97 },
          order: { size: 34, max: 100, hits: 678, misses: 89, hitRate: 0.88 },
        },
        timestamp: new Date().toISOString(),
      };
      
      setStats(mockStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (hitRate: number) => {
    if (hitRate >= 0.9) return 'text-green-600';
    if (hitRate >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (hitRate: number) => {
    if (hitRate >= 0.9) return <Badge variant="default" className="bg-stone-100 text-stone-800">Excellent</Badge>;
    if (hitRate >= 0.7) return <Badge variant="secondary" className="bg-stone-50 text-stone-700">Good</Badge>;
    return <Badge variant="outline" className="border-stone-300 text-stone-600">Needs Improvement</Badge>;
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor database and cache performance in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button onClick={fetchStats} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Cache Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Product Cache</CardTitle>
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-stone-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(stats.cacheStats.product.hitRate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Hit Rate
            </p>
            <div className="mt-2">
              {getPerformanceBadge(stats.cacheStats.product.hitRate)}
            </div>
            <div className="mt-2 text-xs text-stone-600">
              {stats.cacheStats.product.size}/{stats.cacheStats.product.max} items
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">User Cache</CardTitle>
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-stone-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(stats.cacheStats.user.hitRate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Hit Rate
            </p>
            <div className="mt-2">
              {getPerformanceBadge(stats.cacheStats.user.hitRate)}
            </div>
            <div className="mt-2 text-xs text-stone-600">
              {stats.cacheStats.user.size}/{stats.cacheStats.user.max} items
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Category Cache</CardTitle>
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-stone-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(stats.cacheStats.category.hitRate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Hit Rate
            </p>
            <div className="mt-2">
              {getPerformanceBadge(stats.cacheStats.category.hitRate)}
            </div>
            <div className="mt-2 text-xs text-stone-600">
              {stats.cacheStats.category.size}/{stats.cacheStats.category.max} items
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Order Cache</CardTitle>
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-stone-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(stats.cacheStats.order.hitRate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Hit Rate
            </p>
            <div className="mt-2">
              {getPerformanceBadge(stats.cacheStats.order.hitRate)}
            </div>
            <div className="mt-2 text-xs text-stone-600">
              {stats.cacheStats.order.size}/{stats.cacheStats.order.max} items
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Table Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Table Sizes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.tableSizes.map((table) => (
              <div key={table.table_name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{table.table_name.split('.')[1]}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-muted-foreground">
                    Table: {table.table_size}
                  </span>
                  <span className="text-muted-foreground">
                    Index: {table.index_size}
                  </span>
                  <Badge variant="secondary">
                    Total: {table.total_size}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cache Hit Rate Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Cache Hit Rate Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.cacheStats).map(([cacheName, cacheStats]) => (
              <div key={cacheName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{cacheName} Cache</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(cacheStats.hitRate)}`}>
                    {Math.round(cacheStats.hitRate * 100)}%
                  </span>
                </div>
                <Progress value={cacheStats.hitRate * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hits: {cacheStats.hits.toLocaleString()}</span>
                  <span>Misses: {cacheStats.misses.toLocaleString()}</span>
                  <span>Items: {cacheStats.size}/{cacheStats.max}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.cacheStats.product.hitRate < 0.9 && (
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Product Cache Optimization
                  </p>
                  <p className="text-xs text-yellow-700">
                    Consider increasing cache size or implementing cache warming for frequently accessed products.
                  </p>
                </div>
              </div>
            )}
            
            {stats.cacheStats.user.hitRate < 0.9 && (
              <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    User Cache Optimization
                  </p>
                  <p className="text-xs text-blue-700">
                    User authentication queries could benefit from longer cache TTL or Redis implementation.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
              <Clock className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Database Optimization Complete
                </p>
                <p className="text-xs text-green-700">
                  All critical indexes have been created. Monitor performance and consider implementing Redis for distributed caching if needed.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
