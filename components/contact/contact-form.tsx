"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ContactForm() {
  const searchParams = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    const subject = searchParams.get("subject");
    const type = searchParams.get("type");
    const packageId = searchParams.get("package");
    
    if (subject === "service") {
      if (type === "consultation") {
        setSelectedSubject("consultation");
        let message = "Tôi muốn được tư vấn miễn phí về dịch vụ phát triển web. ";
        
        if (packageId) {
          const packageNames: Record<string, string> = {
            "custom-development": "Phát triển dự án theo yêu cầu",
            "project-customization": "Chỉnh sửa dự án có sẵn",
            "maintenance": "Bảo trì & Hỗ trợ",
            "ui-redesign": "Thiết kế lại giao diện",
            "performance-optimization": "Tối ưu hiệu suất",
            "consultation": "Tư vấn kỹ thuật"
          };
          message += `Tôi quan tâm đến gói "${packageNames[packageId] || packageId}". `;
        }
        
        setFormData(prev => ({
          ...prev,
          subject: "consultation",
          message
        }));
      } else if (type === "order") {
        setSelectedSubject("service");
        let message = "Tôi muốn đặt dịch vụ phát triển web. ";
        
        if (packageId) {
          const packageNames: Record<string, string> = {
            "custom-development": "Phát triển dự án theo yêu cầu",
            "project-customization": "Chỉnh sửa dự án có sẵn",
            "maintenance": "Bảo trì & Hỗ trợ",
            "ui-redesign": "Thiết kế lại giao diện",
            "performance-optimization": "Tối ưu hiệu suất",
            "consultation": "Tư vấn kỹ thuật"
          };
          message += `Tôi muốn đặt gói "${packageNames[packageId] || packageId}". `;
        }
        
        setFormData(prev => ({
          ...prev,
          subject: "service",
          message
        }));
      } else if (type === "quote") {
        setSelectedSubject("custom");
        setFormData(prev => ({
          ...prev,
          subject: "custom",
          message: "Tôi muốn yêu cầu báo giá cho dự án phát triển web. "
        }));
      } else if (type === "custom") {
        setSelectedSubject("custom");
        setFormData(prev => ({
          ...prev,
          subject: "custom",
          message: "Tôi muốn tư vấn về gói dịch vụ tùy chỉnh phù hợp với nhu cầu của tôi. "
        }));
      }
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: ""
    });
    setSelectedSubject("");
  };

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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ *</Label>
              <Input 
                id="firstName" 
                placeholder="Nguyễn" 
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Tên *</Label>
              <Input 
                id="lastName" 
                placeholder="Văn A" 
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="0123 456 789" 
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Công ty/Tổ chức</Label>
            <Input 
              id="company" 
              placeholder="Tên công ty của bạn" 
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Chủ đề *</Label>
            <Select 
              value={selectedSubject} 
              onValueChange={(value) => {
                setSelectedSubject(value);
                handleInputChange("subject", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Câu hỏi chung</SelectItem>
                <SelectItem value="product">Sản phẩm source code</SelectItem>
                <SelectItem value="service">Dịch vụ phát triển web</SelectItem>
                <SelectItem value="support">Hỗ trợ kỹ thuật</SelectItem>
                <SelectItem value="partnership">Hợp tác kinh doanh</SelectItem>
                <SelectItem value="custom">Phát triển tùy chỉnh</SelectItem>
                <SelectItem value="maintenance">Bảo trì & Nâng cấp</SelectItem>
                <SelectItem value="consultation">Tư vấn miễn phí</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Tin nhắn *</Label>
            <Textarea 
              id="message" 
              placeholder="Mô tả chi tiết nhu cầu của bạn..."
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Gửi tin nhắn
          </Button>
        </form>
        
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