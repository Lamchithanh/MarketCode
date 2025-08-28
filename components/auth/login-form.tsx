"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { toast, toastMessages } from "@/components/ui/toast";
import { TwoFactorModal } from "@/components/ui/two-factor-modal";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState<{ email: string; password: string }>({ email: "", password: "" });

  console.log('LoginForm render - show2FAModal:', show2FAModal);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      setSuccess("");

      // Step 1: Check if user has 2FA enabled
      console.log('Checking 2FA for email:', data.email);
      const checkResponse = await fetch('/api/auth/check-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });
      
      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        console.log('2FA check result:', checkResult);
        if (checkResult.requires2FA) {
          // If 2FA is required, show modal without signing in yet
          console.log('2FA required, showing modal');
          setLoginCredentials({ email: data.email, password: data.password });
          console.log('Setting show2FAModal to true');
          setShow2FAModal(true);
          console.log('show2FAModal state after setting:', true);
          return;
        }
      }

      // Step 2: Login without 2FA (normal login)
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không chính xác");
        toast.error("Email hoặc mật khẩu không chính xác");
        return;
      }

      if (result?.ok) {
        setSuccess("Đăng nhập thành công!");
        toast.success(toastMessages.auth.loginSuccess);
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "Đã xảy ra lỗi khi đăng nhập";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handle2FASuccess = () => {
    setSuccess("Đăng nhập thành công!");
    toast.success(toastMessages.auth.loginSuccess);
    setShow2FAModal(false);
  };

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
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-4 py-3 rounded-lg text-sm ${
                  error
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}
              >
                {error || success}
              </motion.div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nhap@email.com"
                      className="bg-white/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        className="bg-white/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
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

        {/* Information about 2FA */}
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
      </CardContent>

      {/* 2FA Modal */}
      <TwoFactorModal
        isOpen={show2FAModal}
        onOpenChange={setShow2FAModal}
        email={loginCredentials.email}
        password={loginCredentials.password}
        onSuccess={handle2FASuccess}
        callbackUrl={callbackUrl}
      />
    </>
  );
}
