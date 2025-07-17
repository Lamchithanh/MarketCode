import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Clock, Heart, Globe, Zap, Shield } from "lucide-react";

export function AboutValues() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Những giá trị định hướng mọi hoạt động của chúng tôi trong việc phục vụ cộng đồng developer
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Chất lượng</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Mỗi dòng code được kiểm tra kỹ lưỡng, tuân thủ best practices và standards của ngành
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Tiết kiệm thời gian</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Giúp developers giảm 70% thời gian phát triển bằng cách sử dụng các template chất lượng cao
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Hỗ trợ tận tâm</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Đội ngũ support 24/7 luôn sẵn sàng hỗ trợ bạn trong quá trình sử dụng sản phẩm
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Cộng đồng</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Xây dựng cộng đồng developers mạnh mẽ, chia sẻ kiến thức và hỗ trợ lẫn nhau
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Đổi mới</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Luôn cập nhật xu hướng công nghệ mới nhất và áp dụng vào các sản phẩm
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Bảo mật</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Tuân thủ các tiêu chuẩn bảo mật cao nhất, bảo vệ dữ liệu khách hàng một cách tuyệt đối
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 