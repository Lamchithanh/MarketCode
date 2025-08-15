"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "./password-input";
import { FormFieldComponent } from "./form-field";
import { StatusMessage } from "./status-message";
import { ArrowRight } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterFormData } from "@/lib/validations/auth";

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
  success?: string;
}

export function RegisterForm({ form, onSubmit, isLoading, error, success }: RegisterFormProps) {
  return (
    <>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Tạo tài khoản mới
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Tham gia cộng đồng MarketCode ngay hôm nay
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StatusMessage error={error} success={success} />

            <div className="grid grid-cols-2 gap-4">
              <FormFieldComponent
                form={form}
                name="firstName"
                label="Họ"
                placeholder="Nguyễn"
              />
              <FormFieldComponent
                form={form}
                name="lastName"
                label="Tên"
                placeholder="Văn A"
              />
            </div>

            <FormFieldComponent
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="nhap@email.com"
            />

            <PasswordInput
              form={form}
              name="password"
              label="Mật khẩu"
              placeholder="Tạo mật khẩu mạnh"
            />
            <PasswordInput
              form={form}
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              size="lg"
              disabled={isLoading || !!success}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Đang tạo tài khoản...
                </div>
              ) : success ? (
                "Thành công!"
              ) : (
                <div className="flex items-center gap-2">
                  Tạo tài khoản
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
