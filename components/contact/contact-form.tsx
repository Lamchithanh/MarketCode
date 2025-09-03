"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ContactForm() {
  const searchParams = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim() || !formData.subject?.trim() || !formData.message?.trim()) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.", {
        duration: 4000,
        position: "top-right"
      });
      return;
    }

    // Validate message length
    if (formData.message.trim().length < 5) {
      toast.error("Tin nhắn phải có ít nhất 5 ký tự.", {
        duration: 4000,
        position: "top-right"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Email không hợp lệ.", {
        duration: 4000,
        position: "top-right"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        phone: formData.phone?.trim() || undefined,
        company: formData.company?.trim() || undefined,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra khi gửi tin nhắn');
      }

      // Success
      toast.success(result.message || "Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi trong 24 giờ.", {
        duration: 5000,
        position: "top-right"
      });

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

    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại sau.", {
        duration: 4000,
        position: "top-right"
      });
    } finally {
      setIsSubmitting(false);
    }
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
              placeholder="Mô tả chi tiết nhu cầu của bạn... (tối thiểu 5 ký tự)"
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/5 ký tự tối thiểu
            </p>
          </div>
          
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
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