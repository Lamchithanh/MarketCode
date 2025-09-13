'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

interface TeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember;
  onSaveSuccess: () => void;
}

export function TeamMemberDialog({ 
  open, 
  onOpenChange, 
  member, 
  onSaveSuccess 
}: TeamMemberDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    avatar_url: '',
    description: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        position: member.position,
        avatar_url: member.avatar_url || '',
        description: member.description || '',
        display_order: member.display_order,
        is_active: member.is_active
      });
      setPreviewUrl(member.avatar_url || '');
    } else {
      setFormData({
        name: '',
        position: '',
        avatar_url: '',
        description: '',
        display_order: 0,
        is_active: true
      });
      setPreviewUrl('');
    }
    setSelectedFile(null);
  }, [member, open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Chỉ hỗ trợ file JPG, PNG, WEBP');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File không được vượt quá 2MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(member?.avatar_url || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!selectedFile) return formData.avatar_url;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('memberId', member?.id || 'new');
      if (member?.avatar_url) {
        uploadFormData.append('oldAvatarUrl', member.avatar_url);
      }

      const response = await fetch('/api/admin/team/upload-avatar', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        return result.url;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Lỗi khi upload avatar');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.position.trim()) {
      toast.error('Vui lòng điền tên và chức vụ');
      return;
    }

    setLoading(true);
    
    try {
      // Upload avatar if file selected
      const avatarUrl = await uploadAvatar();
      if (selectedFile && !avatarUrl) {
        // Upload failed, stop submission
        setLoading(false);
        return;
      }

      const dataToSubmit = {
        ...formData,
        avatar_url: avatarUrl || formData.avatar_url
      };

      const url = member ? `/api/admin/team/${member.id}` : '/api/admin/team';
      const method = member ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(member ? 'Cập nhật thành công' : 'Thêm thành viên thành công');
        onSaveSuccess();
      } else {
        toast.error(result.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Lỗi khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {member ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên thành viên"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Chức vụ *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Nhập chức vụ"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="space-y-3">
                {/* Preview */}
                {previewUrl && (
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden group">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* File Input */}
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {selectedFile ? 'Đổi ảnh' : 'Chọn ảnh'}
                  </Button>
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveFile}
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Đã chọn: {selectedFile.name}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ JPG, PNG, WEBP. Tối đa 2MB.
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Mô tả về thành viên..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">Thứ tự hiển thị</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Hiển thị trên trang web</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : (member ? 'Cập nhật' : 'Thêm mới')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}