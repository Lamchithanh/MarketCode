"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "./password-input";
import { FormFieldComponent } from "./form-field";
import { StatusMessage } from "./status-message";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import type { LoginFormData } from "@/lib/validations/auth";

interface LoginFormProps {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
  success?: string;
}

export function LoginForm({ form, onSubmit, isLoading, error, success }: LoginFormProps) {
  return (
    <>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Chào mừng trở lại
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Đăng nhập vào tài khoản MarketCode của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StatusMessage error={error} success={success} />

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
              placeholder="Nhập mật khẩu"
            />

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Đăng nhập
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
