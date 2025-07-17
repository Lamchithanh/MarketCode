"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Calendar
} from "lucide-react";

export function ServiceContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sẵn sàng khởi động dự án của bạn? Hãy liên hệ ngay để nhận tư vấn miễn phí
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Gửi yêu cầu tư vấn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Họ và tên *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div>
                  <Label htmlFor="service" className="text-sm font-medium text-foreground">
                    Dịch vụ quan tâm *
                  </Label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Chọn dịch vụ</option>
                    <option value="custom-development">Phát triển dự án theo yêu cầu</option>
                    <option value="project-customization">Chỉnh sửa dự án có sẵn</option>
                    <option value="maintenance">Bảo trì & Hỗ trợ</option>
                    <option value="ui-redesign">Thiết kế lại giao diện</option>
                    <option value="performance-optimization">Tối ưu hiệu suất</option>
                    <option value="consultation">Tư vấn kỹ thuật</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    Mô tả chi tiết yêu cầu *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-1"
                    placeholder="Mô tả chi tiết về dự án, yêu cầu và mong muốn của bạn..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Gửi yêu cầu tư vấn
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Email</div>
                    <div className="text-muted-foreground">contact@codemarket.vn</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Hotline</div>
                    <div className="text-muted-foreground">+84 123 456 789</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Địa chỉ</div>
                    <div className="text-muted-foreground">123 Đường ABC, Quận 1, TP.HCM</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Giờ làm việc</div>
                    <div className="text-muted-foreground">Thứ 2 - Thứ 6: 8:00 - 17:30</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-card-foreground">
                  Các cách liên hệ khác
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium">WhatsApp</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Chat ngay
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium">Đặt lịch hẹn</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Đặt lịch
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary mr-3" />
                    <span className="font-medium">Gọi điện trực tiếp</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Gọi ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-primary/5 rounded-lg p-8 max-w-4xl mx-auto border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Tư vấn miễn phí 24/7
            </h3>
            <p className="text-muted-foreground mb-6">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi. Đội ngũ chuyên gia của chúng tôi 
              cam kết phản hồi trong vòng 2 giờ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-8 py-3">
                Tư vấn miễn phí ngay
              </Button>
              <Button variant="outline" className="px-8 py-3">
                Tải brochure dịch vụ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 