"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Shield, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { twoFactorSchema } from "@/lib/validations/auth";

interface TwoFactorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  password: string;
  onSuccess: () => void;
  callbackUrl?: string;
}

export function TwoFactorModal({ 
  isOpen, 
  onOpenChange, 
  email, 
  password, 
  onSuccess,
  callbackUrl = "/"
}: TwoFactorModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  console.log('TwoFactorModal render - isOpen:', isOpen, 'email:', email);

  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof twoFactorSchema>) => {
    try {
      setIsVerifying(true);
      setError("");

      const result = await signIn("credentials", {
        email,
        password,
        twoFactorCode: data.code,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("Invalid two-factor authentication code")) {
          setError("Mã 2FA không chính xác. Vui lòng thử lại.");
        } else {
          setError("Có lỗi xảy ra. Vui lòng thử lại.");
        }
        return;
      }

      if (result?.ok) {
        onSuccess();
        onOpenChange(false);
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setError("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold">
            Xác thực 2FA
          </DialogTitle>
          <DialogDescription className="text-center">
            Nhập mã 6 chữ số từ ứng dụng authenticator của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email info */}
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Đăng nhập với: <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* Authenticator info */}
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Smartphone className="h-6 w-6 text-primary flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Google Authenticator</p>
              <p className="text-muted-foreground">Mở ứng dụng và nhập mã 6 chữ số</p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
              {error}
            </div>
          )}

          {/* 2FA Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã xác thực 2FA</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-lg font-mono tracking-widest"
                        autoComplete="one-time-code"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleOpenChange(false)}
                  disabled={isVerifying}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isVerifying || !form.watch("code") || form.watch("code").length !== 6}
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Đang xác thực...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Xác thực
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Help text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Không thể truy cập ứng dụng authenticator?</p>
            <Button variant="link" className="p-0 h-auto text-primary text-sm">
              Sử dụng mã backup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
