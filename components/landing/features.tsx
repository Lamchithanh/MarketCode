import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Shield,
  Zap,
  HeadphonesIcon,
  Download,
  Star,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Feature } from "@/types";

const features: Feature[] = [
  {
    id: "1",
    title: "Code chất lượng cao",
    description:
      "Tất cả source code được kiểm tra kỹ lưỡng, tuân thủ best practices và coding standards hiện đại.",
    icon: "code",
  },
  {
    id: "2",
    title: "Bảo mật tuyệt đối",
    description:
      "Hệ thống thanh toán an toàn, bảo vệ thông tin khách hàng với mã hóa SSL 256-bit.",
    icon: "shield",
  },
  {
    id: "3",
    title: "Tốc độ download nhanh",
    description:
      "Hệ thống CDN toàn cầu đảm bảo tốc độ tải xuống nhanh chóng và ổn định.",
    icon: "zap",
  },
  {
    id: "4",
    title: "Hỗ trợ 24/7",
    description:
      "Đội ngũ kỹ thuật chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
    icon: "headphones",
  },
  {
    id: "5",
    title: "Cập nhật liên tục",
    description:
      "Source code được cập nhật thường xuyên theo xu hướng công nghệ mới nhất.",
    icon: "download",
  },
  {
    id: "6",
    title: "Đánh giá từ cộng đồng",
    description:
      "Hệ thống đánh giá minh bạch giúp bạn chọn lựa sản phẩm phù hợp nhất.",
    icon: "star",
  },
];

const getFeatureIcon = (iconName: string) => {
  const iconClass = "h-8 w-8 text-primary";
  switch (iconName) {
    case "code":
      return <Code className={iconClass} />;
    case "shield":
      return <Shield className={iconClass} />;
    case "zap":
      return <Zap className={iconClass} />;
    case "headphones":
      return <HeadphonesIcon className={iconClass} />;
    case "download":
      return <Download className={iconClass} />;
    case "star":
      return <Star className={iconClass} />;
    default:
      return <Code className={iconClass} />;
  }
};

export function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Tính năng nổi bật
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Tại sao chọn CodeMarket?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Chúng tôi cung cấp giải pháp toàn diện cho mọi nhu cầu phát triển
            web của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="relative group hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">
              Khách hàng tin tưởng
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold mb-2">500+</div>
            <div className="text-sm text-muted-foreground">
              Projects hoàn thành
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold mb-2">2 giờ</div>
            <div className="text-sm text-muted-foreground">
              Thời gian phản hồi
            </div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Độ hài lòng</div>
          </div>
        </div>
      </div>
    </section>
  );
}
