'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Plus, AlertCircle, Edit, Eye, Trash2, MoreHorizontal } from 'lucide-react';
import { useGitCodes } from '@/hooks/use-gitcode';
import type { GitCodeItem } from '@/hooks/use-gitcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface AddGitCodeFormData {
  code: string;
  repo_url: string;
  description: string;
  expire_date: string;
  usage_limit: string;
}

export function AdminGitCodeManagement() {
  const { gitCodes, loading, error, createGitCode, updateGitCode, deleteGitCode, fetchGitCodes } = useGitCodes();
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGitCode, setSelectedGitCode] = useState<GitCodeItem | null>(null);
  
  const [formData, setFormData] = useState<AddGitCodeFormData>({
    code: '',
    repo_url: '',
    description: '',
    expire_date: '',
    usage_limit: ''
  });

  useEffect(() => {
    fetchGitCodes();
  }, [fetchGitCodes]);

  const resetForm = () => {
    setFormData({
      code: '',
      repo_url: '',
      description: '',
      expire_date: '',
      usage_limit: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.repo_url) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const gitCodeData = {
        code: formData.code,
        repo_url: formData.repo_url,
        description: formData.description,
        expire_date: formData.expire_date || undefined,
        usage_limit: formData.usage_limit.trim() === '' ? undefined : parseInt(formData.usage_limit)
      };

      await createGitCode(gitCodeData);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating GitCode:', err);
    }
  };

  const handleEdit = (gitcode: GitCodeItem) => {
    setSelectedGitCode(gitcode);
    setEditDialogOpen(true);
  };

  const handleView = (gitcode: GitCodeItem) => {
    setSelectedGitCode(gitcode);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (gitcode: GitCodeItem) => {
    setSelectedGitCode(gitcode);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGitCode) return;
    
    try {
      setActionLoading(selectedGitCode.id);
      await deleteGitCode(selectedGitCode.id);
      setDeleteDialogOpen(false);
      setSelectedGitCode(null);
    } catch (err) {
      console.error('Error deleting GitCode:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSave = async () => {
    if (!selectedGitCode) return;
    
    try {
      setActionLoading(selectedGitCode.id);
      await updateGitCode(selectedGitCode.id, selectedGitCode);
      setEditDialogOpen(false);
      setSelectedGitCode(null);
    } catch (err) {
      console.error('Error updating GitCode:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách GitCode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Quản lý GitCode</h1>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm GitCode mới
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Có lỗi xảy ra</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tạo GitCode mới</CardTitle>
            <CardDescription>Thêm một GitCode mới vào hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã GitCode *
                  </label>
                  <Input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Nhập mã GitCode"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repository URL *
                  </label>
                  <Input
                    type="url"
                    value={formData.repo_url}
                    onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                    placeholder="https://github.com/user/repo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả về GitCode này"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn
                  </label>
                  <Input
                    type="date"
                    value={formData.expire_date}
                    onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới hạn sử dụng
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Để trống = không giới hạn"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Tạo GitCode
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* GitCode List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách GitCode ({gitCodes.length})</CardTitle>
          <CardDescription>Quản lý tất cả GitCode trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Code</TableHead>
                  <TableHead>Repository</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đã dùng</TableHead>
                  <TableHead>Giới hạn</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gitCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Chưa có GitCode nào được tạo
                    </TableCell>
                  </TableRow>
                ) : (
                  gitCodes.map((gitcode) => (
                    <TableRow key={gitcode.id}>
                      <TableCell className="font-mono font-medium">
                        {gitcode.code}
                      </TableCell>
                      <TableCell>
                        <a 
                          href={gitcode.repo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline truncate block max-w-xs"
                        >
                          {gitcode.repo_url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <span className="truncate block max-w-xs" title={gitcode.description || ''}>
                          {gitcode.description || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          gitcode.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {gitcode.is_active ? 'Hoạt động' : 'Đã tắt'}
                        </span>
                      </TableCell>
                      <TableCell>{gitcode.times_used || 0}</TableCell>
                      <TableCell>{gitcode.usage_limit || 'Không giới hạn'}</TableCell>
                      <TableCell>
                        {gitcode.expire_date 
                          ? new Date(gitcode.expire_date).toLocaleDateString('vi-VN')
                          : 'Không có'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => handleEdit(gitcode)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleView(gitcode)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(gitcode)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit GitCode Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Chỉnh sửa GitCode</AlertDialogTitle>
            <AlertDialogDescription>
              Cập nhật thông tin cho GitCode đã chọn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedGitCode && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Mã GitCode</label>
                <Input
                  value={selectedGitCode.code}
                  onChange={(e) =>
                    setSelectedGitCode({ ...selectedGitCode, code: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Repository URL</label>
                <Input
                  value={selectedGitCode.repo_url}
                  onChange={(e) =>
                    setSelectedGitCode({ ...selectedGitCode, repo_url: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input
                  value={selectedGitCode.description || ''}
                  onChange={(e) =>
                    setSelectedGitCode({ ...selectedGitCode, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Giới hạn sử dụng</label>
                  <Input
                    type="number"
                    value={selectedGitCode.usage_limit || ''}
                    onChange={(e) =>
                      setSelectedGitCode({
                        ...selectedGitCode,
                        usage_limit: e.target.value.trim() === '' ? null : parseInt(e.target.value)
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày hết hạn</label>
                  <Input
                    type="date"
                    value={
                      selectedGitCode.expire_date
                        ? new Date(selectedGitCode.expire_date).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setSelectedGitCode({
                        ...selectedGitCode,
                        expire_date: e.target.value || null
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={selectedGitCode.is_active}
                  onChange={(e) =>
                    setSelectedGitCode({ ...selectedGitCode, is_active: e.target.checked })
                  }
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Đang hoạt động
                </label>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleEditSave}
              disabled={actionLoading !== null}
            >
              {actionLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Chi tiết GitCode</AlertDialogTitle>
          </AlertDialogHeader>
          {selectedGitCode && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã GitCode</label>
                  <p className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {selectedGitCode.code}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                  <p>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        selectedGitCode.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {selectedGitCode.is_active ? 'Đang hoạt động' : 'Đã tắt'}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Repository URL</label>
                <p className="break-all">{selectedGitCode.repo_url}</p>
              </div>
              {selectedGitCode.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Mô tả</label>
                  <p>{selectedGitCode.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Đã sử dụng</label>
                  <p>{selectedGitCode.times_used || 0} lần</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Giới hạn</label>
                  <p>{selectedGitCode.usage_limit ? `${selectedGitCode.usage_limit} lần` : 'Không giới hạn'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                  <p>{new Date(selectedGitCode.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                {selectedGitCode.expire_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày hết hạn</label>
                    <p>{new Date(selectedGitCode.expire_date).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction>Đóng</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa GitCode</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa GitCode &quot;{selectedGitCode?.code}&quot;? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={actionLoading !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? 'Đang xóa...' : 'Xóa GitCode'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
