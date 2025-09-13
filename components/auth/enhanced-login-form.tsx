"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PasswordInput } from "./password-input";
import { FormFieldComponent } from "./form-field";
import { StatusMessage } from "./status-message";
import { ArrowRight, Shield, Smartphone } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Enhanced login schema with 2FA support
const enhancedLoginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  twoFactorCode: z
    .string()
    .optional()
    .refine((val) => !val || (val.length === 6 && /^\d{6}$/.test(val)), {
      message: "Mã 2FA phải là 6 chữ số"
    }),
});

type EnhancedLoginFormData = z.infer<typeof enhancedLoginSchema>;

interface EnhancedLoginFormProps {
  callbackUrl?: string;
}

export function EnhancedLoginForm({ callbackUrl = "/" }: EnhancedLoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<{email: string; password: string} | null>(null);

  const form = useForm<EnhancedLoginFormData>({
    resolver: zodResolver(enhancedLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      twoFactorCode: "",
    },
  });

  const onSubmit = async (data: EnhancedLoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      // If 2FA is required, use saved credentials + 2FA code
      const loginData = requires2FA && savedCredentials ? {
        email: savedCredentials.email,
        password: savedCredentials.password,
        twoFactorCode: data.twoFactorCode || "",
      } : {
        email: data.email,
        password: data.password,
        twoFactorCode: data.twoFactorCode || "",
      };

      const result = await signIn("credentials", {
        ...loginData,
        redirect: false,
      });

      if (result?.error) {
        // Check if 2FA is required
        if (result.error === "Two-factor authentication is required") {
          setRequires2FA(true);
          setSavedCredentials({ email: data.email, password: data.password });
          setError("Vui lòng nhập mã xác thực 2FA từ ứng dụng authenticator của bạn");
          return;
        }
        
        if (result.error === "Invalid two-factor authentication code") {
          setError("Mã 2FA không chính xác. Vui lòng thử lại.");
          return;
        }

        setError("Email hoặc mật khẩu không chính xác");
        return;
      }

      if (result?.ok) {
        setSuccess("Đăng nhập thành công!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRequires2FA(false);
    setSavedCredentials(null);
    setError("");
    form.reset();
  };

  return (
    <>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {requires2FA ? (
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Xác thực 2FA
            </div>
          ) : (
            "Chào mừng trở lại"
          )}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {requires2FA ? (
            <div className="space-y-2">
              <div>Nhập mã 6 chữ số từ ứng dụng authenticator</div>
              <div className="text-sm text-muted-foreground">
                Đăng nhập với: <span className="font-medium">{savedCredentials?.email}</span>
              </div>
            </div>
          ) : (
            "Đăng nhập vào tài khoản MarketCode của bạn"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StatusMessage error={error} success={success} />

            {!requires2FA ? (
              <>
                {/* Standard login fields */}
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
              </>
            ) : (
              <>
                {/* 2FA code field */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-center space-y-2">
                      <Smartphone className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Mở ứng dụng authenticator và nhập mã 6 chữ số
                      </p>
                    </div>
                  </div>

                  <FormFieldComponent
                    form={form}
                    name="twoFactorCode"
                    label="Mã xác thực 2FA"
                    placeholder="123456"
                    className="text-center text-lg font-mono tracking-widest"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="w-full"
                  >
                    ← Quay lại đăng nhập
                  </Button>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {requires2FA ? "Đang xác thực..." : "Đang đăng nhập..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {requires2FA ? (
                    <>
                      <Shield className="h-4 w-4" />
                      Xác thực 2FA
                    </>
                  ) : (
                    <>
                      Đăng nhập
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </div>
              )}
            </Button>
          </form>
        </Form>

        {/* Information about 2FA */}
        {!requires2FA && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Bảo mật nâng cao với 2FA</p>
                <p>
                  Nếu bạn đã bật xác thực 2FA, hệ thống sẽ yêu cầu mã xác thực từ ứng dụng authenticator sau khi nhập đúng mật khẩu.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
