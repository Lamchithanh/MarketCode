import { Target, Shield, Zap, Heart, Star } from "lucide-react";

export function AboutMission() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tại CodeMarket, chúng tôi tin rằng mỗi nhà phát triển đều xứng đáng có được những công cụ và source code chất lượng cao để biến ý tưởng thành hiện thực.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Chúng tôi cam kết cung cấp các source code React/NextJS được xây dựng với tiêu chuẩn enterprise, giúp bạn tiết kiệm thời gian và tăng hiệu quả phát triển.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Chất lượng cao</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Bảo mật tốt</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Hiệu suất cao</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">CodeMarket</h3>
                    <p className="text-muted-foreground">Source Code Marketplace</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Dự án hoàn thành</span>
                    <span className="text-sm font-bold">500+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Khách hàng hài lòng</span>
                    <span className="text-sm font-bold">1,000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Đánh giá trung bình</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-bold">4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 