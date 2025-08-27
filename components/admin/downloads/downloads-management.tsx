'use client';

import { useState } from 'react';
import { RefreshCw, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDownloads } from '@/hooks/use-downloads';
import Image from 'next/image';

interface Download {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productThumbnail: string;
  downloadDate: string;
  ipAddress: string;
  userAgent: string;
  githubUrl: string;
}

export default function DownloadsManagement() {
  const { downloads, loading, error, stats, fetchDownloads, searchDownloads, deleteDownload } = useDownloads();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [downloadToDelete, setDownloadToDelete] = useState<Download | null>(null);

  const filteredDownloads = searchDownloads(downloads, searchTerm);

  const handleDeleteClick = (download: Download) => {
    setDownloadToDelete(download);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (downloadToDelete) {
      await deleteDownload(downloadToDelete.id);
      setDeleteDialogOpen(false);
      setDownloadToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Đang tải dữ liệu downloads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Lỗi: {error}</p>
              <Button onClick={fetchDownloads} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản Lý Downloads</h1>
        <Button onClick={fetchDownloads} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Người dùng duy nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Downloads tuần này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentDownloads}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm phổ biến nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {stats.topProducts[0]?.name || 'Chưa có data'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Tìm theo tên người dùng, email hoặc sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Downloads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Downloads ({filteredDownloads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDownloads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu downloads
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Người dùng</th>
                    <th className="text-left p-2">Sản phẩm</th>
                    <th className="text-left p-2">Thời gian</th>
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-left p-2">GitHub URL</th>
                    <th className="text-left p-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDownloads.map((download: Download) => (
                    <tr key={download.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{download.userName || 'Unknown User'}</div>
                          <div className="text-gray-500">{download.userEmail || 'No Email'}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Image 
                            src={download.productThumbnail || '/placeholder-image.jpg'} 
                            alt={`Thumbnail của sản phẩm ${download.productName || 'Unknown Product'}`}
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                          <span>{download.productName || 'Unknown Product'}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-sm">
                          {download.downloadDate && download.downloadDate !== 'Invalid Date' 
                            ? new Date(download.downloadDate).toLocaleString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Không xác định'
                          }
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{download.ipAddress || '---'}</Badge>
                      </td>
                      <td className="p-2">
                        {download.githubUrl && download.githubUrl !== '#' ? (
                          <a 
                            href={download.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center space-x-1"
                          >
                            <span>GitHub Repository</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400">Không có</span>
                        )}
                      </td>
                      <td className="p-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteClick(download)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bản ghi download này không?
              {downloadToDelete && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <div><strong>Người dùng:</strong> {downloadToDelete.userName}</div>
                  <div><strong>Sản phẩm:</strong> {downloadToDelete.productName}</div>
                  <div><strong>Thời gian:</strong> {new Date(downloadToDelete.downloadDate).toLocaleString('vi-VN')}</div>
                </div>
              )}
              <p className="mt-2 text-red-600 font-medium">
                Hành động này không thể hoàn tác!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
