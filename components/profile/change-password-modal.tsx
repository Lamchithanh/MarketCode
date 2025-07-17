"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Save, X } from "lucide-react";
import { 
  changePasswordSchema, 
  type ChangePasswordForm 
} from "@/lib/validations/profile";

interface ChangePasswordModalProps {
  onPasswordChange?: (data: ChangePasswordForm) => Promise<void>;
  disabled?: boolean;
}

export function ChangePasswordModal({ onPasswordChange, disabled = false }: ChangePasswordModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ChangePasswordForm) => {
    try {
      await onPasswordChange?.(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      // TODO: Show error toast
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Key className="h-4 w-4 mr-2" />
          Đổi mật khẩu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Đổi mật khẩu
          </DialogTitle>
          <DialogDescription>
            Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Nhập mật khẩu hiện tại" 
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Nhập mật khẩu mới" 
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Xác nhận mật khẩu mới" 
                      {...field} 
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </DialogContent>
    </Dialog>
  );
} 