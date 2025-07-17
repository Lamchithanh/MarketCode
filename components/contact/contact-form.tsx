"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send } from "lucide-react";
import Link from "next/link";

export function ContactForm() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Gửi tin nhắn
        </CardTitle>
        <CardDescription>
          Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong 24 giờ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Họ *</Label>
            <Input id="firstName" placeholder="Nguyễn" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Tên *</Label>
            <Input id="lastName" placeholder="Văn A" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="your@email.com" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" type="tel" placeholder="0123 456 789" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Công ty/Tổ chức</Label>
          <Input id="company" placeholder="Tên công ty của bạn" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Chủ đề *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Chọn chủ đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Câu hỏi chung</SelectItem>
              <SelectItem value="product">Sản phẩm</SelectItem>
              <SelectItem value="service">Dịch vụ</SelectItem>
              <SelectItem value="support">Hỗ trợ kỹ thuật</SelectItem>
              <SelectItem value="partnership">Hợp tác kinh doanh</SelectItem>
              <SelectItem value="custom">Phát triển tùy chỉnh</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Tin nhắn *</Label>
          <Textarea 
            id="message" 
            placeholder="Mô tả chi tiết nhu cầu của bạn..."
            rows={5}
          />
        </div>
        
        <Button className="w-full" size="lg">
          <Send className="h-4 w-4 mr-2" />
          Gửi tin nhắn
        </Button>
        
        <p className="text-sm text-muted-foreground text-center">
          Bằng cách gửi tin nhắn, bạn đồng ý với{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi
        </p>
      </CardContent>
    </Card>
  );
} 