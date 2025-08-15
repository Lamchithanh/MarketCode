"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast, toastMessages } from "@/components/ui/toast";

interface AuthFormProps {
  mode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

export function AuthForm({ mode: propMode, onModeChange }: AuthFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<"login" | "register">(propMode || "login");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update mode based on pathname or prop (only on initial load)
  useEffect(() => {
    if (propMode) {
      setMode(propMode);
    } else if (pathname.includes("/register")) {
      setMode("register");
    } else if (pathname.includes("/login")) {
      setMode("login");
    }
  }, [propMode]); // Remove pathname dependency to avoid conflicts

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleModeSwitch = (newMode: "login" | "register") => {
    // Prevent double clicks
    if (mode === newMode) return;
    
    setMode(newMode);
    setError("");
    setSuccess("");
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setError("");
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
        toast.success(toastMessages.auth.loginSuccess);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "Đã xảy ra lỗi khi đăng nhập";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || "Đã xảy ra lỗi khi đăng ký";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const successMessage = "Tài khoản đã được tạo thành công!";
      setSuccess(successMessage);
      toast.success(successMessage);
      
      // Auto switch to login after 2 seconds
      setTimeout(() => {
        handleModeSwitch("login");
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = "Đã xảy ra lỗi khi đăng ký";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const formVariants = {
    enter: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      x: mode === "login" ? -50 : 50, 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    initial: { 
      x: mode === "login" ? 50 : -50, 
      opacity: 0 
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Mode Switch Buttons */}
      <div className="flex mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm">
        <button
          type="button"
          className={`flex-1 relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            mode === "login" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
          }`}
          onClick={() => handleModeSwitch("login")}
        >
          {mode === "login" && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary rounded-lg"
              initial={false}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
          <span className="relative z-10">Đăng nhập</span>
        </button>
        <button
          type="button"
          className={`flex-1 relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            mode === "register" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
          }`}
          onClick={() => handleModeSwitch("register")}
        >
          {mode === "register" && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary rounded-lg"
              initial={false}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          )}
          <span className="relative z-10">Đăng ký</span>
        </button>
      </div>

      {/* Form Container */}
      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={formVariants}
              initial="initial" 
              animate="enter"
              exit="exit"
            >
              {mode === "login" ? (
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
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
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
                          control={loginForm.control}
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
                          control={loginForm.control}
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
                          disabled={loginForm.formState.isSubmitting}
                        >
                          {loginForm.formState.isSubmitting ? (
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
              ) : (
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
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
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

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Họ</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Nguyễn"
                                    className="bg-white/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tên</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Văn A"
                                    className="bg-white/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={registerForm.control}
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
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Tạo mật khẩu mạnh"
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

                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Xác nhận mật khẩu</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu"
                                    className="bg-white/50 backdrop-blur-sm border-primary/20 focus:border-primary/40 pr-10"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
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

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                          size="lg"
                          disabled={registerForm.formState.isSubmitting || !!success}
                        >
                          {registerForm.formState.isSubmitting ? (
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
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
