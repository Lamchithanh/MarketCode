"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { 
  Send, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ServiceOrderFormProps {
  serviceId: string;
  serviceType: string;
  serviceName: string;
  servicePrice: string;
  serviceDuration: string;
}

export function ServiceOrderForm({ serviceId, serviceType, serviceName, servicePrice, serviceDuration }: ServiceOrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDescription: "",
    budget: "",
    timeline: "",
    requirements: "",
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error("Vui lòng đồng ý với điều khoản dịch vụ");
      return;
    }
    
    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToast = toast.loading("Đang gửi yêu cầu dịch vụ...");
    
    try {
      const serviceRequestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        service_type: serviceType, // Use serviceType instead of serviceId
        service_name: serviceName,
        title: `Yêu cầu dịch vụ: ${serviceName}`,
        description: formData.projectDescription,
        budget_range: formData.budget,
        timeline: formData.timeline,
        priority: 'medium',
        requirements: {
          specific_requirements: formData.requirements,
          price_info: servicePrice,
          duration_info: serviceDuration
        }
      };

      console.log('Submitting service request:', serviceRequestData);

      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceRequestData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Server error:', responseData);
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("🎉 Yêu cầu dịch vụ đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.", {
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectDescription: "",
        budget: "",
        timeline: "",
        requirements: "",
        agreeToTerms: false
      });
      
    } catch (error) {
      console.error('Error submitting service request:', error);
      
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi yêu cầu";
      toast.error(`❌ ${errorMessage}. Vui lòng thử lại sau.`, {
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Đặt dịch vụ: {serviceName}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {servicePrice}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {serviceDuration}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin khách hàng */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thông tin khách hàng</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0123 456 789"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Công ty/Tổ chức</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Tên công ty của bạn"
              />
            </div>
          </div>

          {/* Chi tiết dự án */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Chi tiết dự án</h3>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Mô tả dự án *</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                placeholder="Mô tả chi tiết về dự án, mục tiêu, yêu cầu chức năng..."
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Ngân sách dự kiến</Label>
                <Select onValueChange={(value) => handleInputChange("budget", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ngân sách" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-5m">Dưới 5 triệu</SelectItem>
                    <SelectItem value="5m-10m">5 - 10 triệu</SelectItem>
                    <SelectItem value="10m-20m">10 - 20 triệu</SelectItem>
                    <SelectItem value="20m-50m">20 - 50 triệu</SelectItem>
                    <SelectItem value="over-50m">Trên 50 triệu</SelectItem>
                    <SelectItem value="flexible">Linh hoạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeline">Thời gian mong muốn</Label>
                <Select onValueChange={(value) => handleInputChange("timeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">Càng sớm càng tốt</SelectItem>
                    <SelectItem value="1-2weeks">1-2 tuần</SelectItem>
                    <SelectItem value="1month">1 tháng</SelectItem>
                    <SelectItem value="2-3months">2-3 tháng</SelectItem>
                    <SelectItem value="flexible">Linh hoạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Yêu cầu đặc biệt</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="Các yêu cầu kỹ thuật, tích hợp, bảo mật đặc biệt..."
                rows={3}
              />
            </div>
          </div>

          {/* Điều khoản */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                Tôi đồng ý với{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Chính sách bảo mật
                </a>
              </Label>
            </div>
          </div>

          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={!formData.agreeToTerms || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi yêu cầu...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Gửi yêu cầu đặt dịch vụ
              </>
            )}
          </Button>
        </form>

        {/* Thông tin hỗ trợ */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <h4 className="font-semibold mb-2">Sau khi gửi yêu cầu:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Chúng tôi sẽ liên hệ trong vòng 2 giờ</li>
            <li>• Tư vấn chi tiết và báo giá chính xác</li>
            <li>• Lập kế hoạch triển khai dự án</li>
            <li>• Ký hợp đồng và bắt đầu thực hiện</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 