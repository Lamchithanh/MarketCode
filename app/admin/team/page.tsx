'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { TeamMemberDialog } from '@/components/admin/team-member-dialog';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function TeamManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>();

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team');
      const result = await response.json();
      
      if (result.success) {
        setTeamMembers(result.data);
      } else {
        toast.error('Không thể tải danh sách team');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleCreate = () => {
    setEditingMember(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDelete = async (memberId: string, memberName: string) => {
    // Sử dụng toast confirm thay vì window.confirm
    toast.warning(
      `Xóa ${memberName} khỏi team?`,
      {
        action: {
          label: 'Xóa',
          onClick: async () => {
            try {
              const response = await fetch(`/api/admin/team/${memberId}`, {
                method: 'DELETE',
              });
              
              const result = await response.json();
              
              if (result.success) {
                toast.success('Đã xóa thành viên thành công');
                fetchTeamMembers();
              } else {
                toast.error('Không thể xóa thành viên');
              }
            } catch (error) {
              console.error('Error deleting team member:', error);
              toast.error('Lỗi khi xóa thành viên');
            }
          },
        },
        cancel: {
          label: 'Hủy',
          onClick: () => {
            // Do nothing
          },
        }
      }
    );
  };

  const handleSaveSuccess = () => {
    setDialogOpen(false);
    fetchTeamMembers();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Quản lý Team</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin các thành viên trong đội ngũ
            </p>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm thành viên
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id} className="relative group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(member.id, member.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {member.position}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {member.avatar_url && (
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                {member.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {member.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Thứ tự: {member.display_order}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    member.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.is_active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Chưa có thành viên nào</h3>
          <p className="text-muted-foreground mb-4">
            Bắt đầu bằng cách thêm thành viên đầu tiên cho team
          </p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thành viên đầu tiên
          </Button>
        </div>
      )}

      <TeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}