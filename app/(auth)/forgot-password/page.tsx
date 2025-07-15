"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

const ForgotPasswordPage = () => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Forgot password data:", data);
    // Xử lý logic gửi email reset password ở đây
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Đang gửi..."
                : "Gửi liên kết đặt lại"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-4">
            Chúng tôi sẽ gửi liên kết đặt lại mật khẩu đến email của bạn.
          </p>
        </div>

        <Separator className="my-4" />
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Nhớ mật khẩu rồi?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
