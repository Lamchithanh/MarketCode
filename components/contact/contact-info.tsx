import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Headphones, CheckCircle } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Thông tin liên hệ
          </CardTitle>
          <CardDescription>
            Các cách khác để liên hệ với chúng tôi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground">support@codemarket.vn</p>
              <p className="text-muted-foreground">sales@codemarket.vn</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Điện thoại</p>
              <p className="text-muted-foreground">+84 123 456 789</p>
              <p className="text-muted-foreground">+84 987 654 321</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Địa chỉ</p>
              <p className="text-muted-foreground">
                123 Đường ABC, Quận 1<br />
                Thành phố Hồ Chí Minh, Việt Nam
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Giờ làm việc</p>
              <p className="text-muted-foreground">
                Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                Thứ 7: 8:00 - 12:00<br />
                Chủ nhật: Nghỉ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Cam kết của chúng tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm">Phản hồi trong 24 giờ</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm">Tư vấn miễn phí</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm">Hỗ trợ 24/7</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm">Bảo mật thông tin</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 