'use client';

import { useState } from 'react';
import { Search, ExternalLink, Github, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useUserDownloads } from '@/hooks/use-user-downloads';

export function ProfileDownloads() {
  const [searchTerm, setSearchTerm] = useState('');
  const { downloads, loading, error } = useUserDownloads();

  const filteredDownloads = downloads.filter(download =>
    download.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Lịch sử tải xuống
          </CardTitle>
          <CardDescription>
            Quản lý và truy cập các sản phẩm bạn đã tải xuống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm đã tải..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredDownloads.length === 0 ? (
            <div className="text-center py-8">
              <Github className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Bạn chưa tải xuống sản phẩm nào'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDownloads.map((download) => (
                <div key={download.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <Image
                    src={download.productThumbnail || '/placeholder-image.jpg'}
                    alt={download.productName || 'Product'}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {download.productName || 'Tên sản phẩm không có'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Tải xuống: {new Date(download.downloadDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(download.githubUrl, '_blank')}
                    className="flex items-center gap-2"
                    disabled={!download.githubUrl}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Truy cập GitHub
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
