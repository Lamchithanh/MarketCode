"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, Save, X } from "lucide-react";
import { toast } from "sonner";
import { AvatarUpload } from "./avatar-upload";
import { 
  updateProfileSchema, 
  type UpdateProfileForm 
} from "@/lib/validations/profile";

interface UpdateProfileModalProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  onProfileUpdate?: (data: UpdateProfileForm) => Promise<void>;
  onAvatarChange?: (avatarUrl: string | null) => Promise<void>;
  disabled?: boolean;
}

export function UpdateProfileModal({ 
  user, 
  onProfileUpdate, 
  onAvatarChange, 
  disabled = false 
}: UpdateProfileModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const handleSubmit = async (data: UpdateProfileForm) => {
    try {
      await onProfileUpdate?.(data);
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại!");
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const handleAvatarChange = async (avatarUrl: string | null) => {
    try {
      await onAvatarChange?.(avatarUrl);
    } catch (error) {
      console.error("Error handling avatar change:", error);
      toast.error("Không thể cập nhật ảnh đại diện. Vui lòng thử lại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Settings className="h-4 w-4 mr-2" />
          Cập nhật thông tin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cập nhật thông tin
          </DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin cá nhân của bạn
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Ảnh đại diện</Label>
            <AvatarUpload
              currentAvatar={user.avatar || undefined}
              userName={user.name || "User"}
              onAvatarChange={handleAvatarChange}
              size="lg"
              disabled={form.formState.isSubmitting}
            />
          </div>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập họ tên" 
                          {...field} 
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Nhập email" 
                          {...field} 
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={form.formState.isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 