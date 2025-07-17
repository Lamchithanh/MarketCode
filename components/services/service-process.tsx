"use client";

import { 
  MessageSquare, 
  FileText, 
  Code, 
  TestTube, 
  Rocket, 
  HeadphonesIcon,
  Clock,
  Award,
  Shield
} from "lucide-react";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
}

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Tư vấn & Phân tích",
    description: "Trao đổi chi tiết về yêu cầu, phân tích nhu cầu và đưa ra giải pháp tối ưu",
    icon: <MessageSquare className="h-6 w-6" />,
    duration: "1-2 ngày"
  },
  {
    step: 2,
    title: "Lập kế hoạch",
    description: "Xây dựng kế hoạch chi tiết, timeline và báo giá chính xác cho dự án",
    icon: <FileText className="h-6 w-6" />,
    duration: "1-3 ngày"
  },
  {
    step: 3,
    title: "Phát triển",
    description: "Triển khai dự án theo kế hoạch với cập nhật tiến độ định kỳ",
    icon: <Code className="h-6 w-6" />,
    duration: "1-6 tuần"
  },
  {
    step: 4,
    title: "Kiểm thử",
    description: "Kiểm tra chất lượng, test tính năng và tối ưu hiệu suất",
    icon: <TestTube className="h-6 w-6" />,
    duration: "3-5 ngày"
  },
  {
    step: 5,
    title: "Triển khai",
    description: "Deploy lên server, cấu hình domain và go-live chính thức",
    icon: <Rocket className="h-6 w-6" />,
    duration: "1-2 ngày"
  },
  {
    step: 6,
    title: "Hỗ trợ",
    description: "Hỗ trợ kỹ thuật, bảo trì và cập nhật sau khi bàn giao",
    icon: <HeadphonesIcon className="h-6 w-6" />,
    duration: "Liên tục"
  }
];

export function ServiceProcess() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quy trình làm việc chuyên nghiệp
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chúng tôi tuân thủ quy trình chuẩn để đảm bảo chất lượng và tiến độ dự án
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connection line */}
              {index < processSteps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-primary/20 z-0" />
              )}
              
              <div className="relative bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {step.step}. {step.title}
                      </h3>
                      <span className="text-sm text-primary font-medium">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-card rounded-lg p-8 shadow-lg border">
          <h3 className="text-2xl font-bold text-card-foreground mb-4 text-center">
            Cam kết của chúng tôi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-card-foreground mb-2">
                Đúng tiến độ
              </h4>
              <p className="text-muted-foreground">
                Hoàn thành dự án đúng thời hạn đã cam kết
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-card-foreground mb-2">
                Chất lượng cao
              </h4>
              <p className="text-muted-foreground">
                Code sạch, tối ưu và tuân thủ best practices
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-card-foreground mb-2">
                Bảo hành
              </h4>
              <p className="text-muted-foreground">
                Hỗ trợ miễn phí trong thời gian bảo hành
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 