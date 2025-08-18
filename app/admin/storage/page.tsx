'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, BarChart3, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface StorageStats {
  totalFiles: number;
  totalSizeBytes: number;
}

interface CleanupResult {
  success: boolean;
  deletedFiles: string[];
  errors: string[];
  message: string;
}

export default function StorageManagementPage() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stats' })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch storage stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch storage statistics');
    } finally {
      setLoading(false);
    }
  };

  const runCleanup = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' })
      });

      if (!response.ok) {
        throw new Error('Failed to run cleanup');
      }

      const result = await response.json();
      setCleanupResult(result);
      
      if (result.success) {
        toast.success(result.message);
        // Refresh stats after cleanup
        await fetchStats();
      } else {
        toast.error('Cleanup completed with errors');
      }
    } catch (error) {
      console.error('Error running cleanup:', error);
      toast.error('Failed to run storage cleanup');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Storage Management</h1>
          <p className="text-muted-foreground">
            Manage product images and storage cleanup
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={fetchStats} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>
          
          <Button 
            onClick={runCleanup} 
            disabled={loading}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Run Cleanup
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Storage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Storage Statistics
            </CardTitle>
            <CardDescription>
              Overview of current storage usage for product images
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{stats.totalFiles}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold">{formatFileSize(stats.totalSizeBytes)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Click &ldquo;Refresh Stats&rdquo; to load storage information</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cleanup Results */}
        {cleanupResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Last Cleanup Result
              </CardTitle>
              <CardDescription>
                Results from the most recent storage cleanup operation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={cleanupResult.success ? 'default' : 'destructive'}>
                  {cleanupResult.success ? 'Success' : 'Warning'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {cleanupResult.message}
                </span>
              </div>

              {cleanupResult.deletedFiles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Deleted Files ({cleanupResult.deletedFiles.length})</h4>
                  <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                    {cleanupResult.deletedFiles.map((file, index) => (
                      <div key={index} className="text-sm font-mono">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cleanupResult.errors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Errors ({cleanupResult.errors.length})
                  </h4>
                  <div className="bg-destructive/10 p-3 rounded-md max-h-40 overflow-y-auto">
                    {cleanupResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-destructive">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cleanupResult.deletedFiles.length === 0 && cleanupResult.errors.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No orphaned files found. Storage is clean!
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle>How Storage Cleanup Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Automatic Cleanup</h4>
              <p className="text-sm text-muted-foreground">
                Images are automatically deleted from storage when:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>A product is deleted (soft delete)</li>
                <li>Product images are updated or removed</li>
                <li>Individual images are removed from product</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Manual Cleanup</h4>
              <p className="text-sm text-muted-foreground">
                The manual cleanup function finds and removes orphaned images that are no longer 
                referenced by any product in the database. This is useful for:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>Cleaning up after data migrations</li>
                <li>Removing files from failed upload operations</li>
                <li>General storage maintenance</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-md border border-yellow-200 dark:border-yellow-900/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <strong className="text-yellow-800 dark:text-yellow-200">Warning:</strong>
                  <span className="text-yellow-700 dark:text-yellow-300 ml-1">
                    Manual cleanup permanently deletes files. This action cannot be undone.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
