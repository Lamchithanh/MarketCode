'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { DownloadsHeader } from './downloads-header';
import { DownloadsStats } from './downloads-stats';
import { DownloadsSearch } from './downloads-search';
import { DownloadsDataTable } from './downloads-data-table';
import { DownloadViewDialog } from './download-view-dialog';
import { DownloadEditDialog } from './download-edit-dialog';
import { DownloadDeleteDialog } from './download-delete-dialog';

interface DownloadItem {
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
  status: "completed" | "failed" | "pending";
  downloadCount: number;
}

const mockDownloads: DownloadItem[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    productId: "prod1",
    productName: "React Admin Dashboard",
    productThumbnail: "/api/placeholder/40/40",
    downloadDate: "2024-01-15T10:30:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "completed",
    downloadCount: 1,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    productId: "prod2",
    productName: "Vue.js Template",
    productThumbnail: "/api/placeholder/40/40",
    downloadDate: "2024-01-15T09:15:00Z",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "completed",
    downloadCount: 2,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    productId: "prod3",
    productName: "Angular Starter Kit",
    productThumbnail: "/api/placeholder/40/40",
    downloadDate: "2024-01-15T08:45:00Z",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    status: "failed",
    downloadCount: 0,
  },
  {
    id: "4",
    userId: "user4",
    userName: "Alice Brown",
    userEmail: "alice@example.com",
    productId: "prod1",
    productName: "React Admin Dashboard",
    productThumbnail: "/api/placeholder/40/40",
    downloadDate: "2024-01-14T16:20:00Z",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "completed",
    downloadCount: 1,
  },
  {
    id: "5",
    userId: "user5",
    userName: "Charlie Wilson",
    userEmail: "charlie@example.com",
    productId: "prod4",
    productName: "Next.js E-commerce",
    productThumbnail: "/api/placeholder/40/40",
    downloadDate: "2024-01-14T14:10:00Z",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "pending",
    downloadCount: 0,
  },
];

export function DownloadsManagement() {
  const [downloads, setDownloads] = useState<DownloadItem[]>(mockDownloads);
  const [filteredDownloads, setFilteredDownloads] = useState<DownloadItem[]>(mockDownloads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDownload, setSelectedDownload] = useState<DownloadItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filter downloads based on search term and status
  useEffect(() => {
    let filtered = downloads;
    
    if (searchTerm) {
      filtered = filtered.filter(download =>
        download.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        download.ipAddress.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(download => download.status === statusFilter);
    }
    
    setFilteredDownloads(filtered);
  }, [downloads, searchTerm, statusFilter]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDownload = (download: DownloadItem) => {
    setSelectedDownload(download);
    setIsViewDialogOpen(true);
  };

  const handleEditDownload = (download: DownloadItem) => {
    setSelectedDownload(download);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDownload = (download: DownloadItem) => {
    setSelectedDownload(download);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveDownload = (updatedDownload: DownloadItem) => {
    setDownloads(downloads.map(d => d.id === updatedDownload.id ? updatedDownload : d));
    setSelectedDownload(null);
  };

  const handleConfirmDelete = (downloadToDelete: DownloadItem) => {
    setDownloads(downloads.filter(d => d.id !== downloadToDelete.id));
    setSelectedDownload(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DownloadsHeader />

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
      <DownloadsStats downloads={downloads} />

      {/* Search and Filters */}
      <DownloadsSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Downloads Table */}
      <DownloadsDataTable
        downloads={filteredDownloads}
        onViewDownload={handleViewDownload}
        onEditDownload={handleEditDownload}
        onDeleteDownload={handleDeleteDownload}
      />

      {/* View Download Dialog */}
      <DownloadViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        download={selectedDownload}
      />

      {/* Edit Download Dialog */}
      <DownloadEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        download={selectedDownload}
        onSave={handleSaveDownload}
      />

      {/* Delete Download Dialog */}
      <DownloadDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        download={selectedDownload}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
