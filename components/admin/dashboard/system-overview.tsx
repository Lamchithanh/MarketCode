import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Download, Star, Mail, MessageSquare } from "lucide-react";

interface SystemOverviewProps {
  totalDownloads: number;
  averageRating: number;
  newsletterSubscribers: number;
  pendingMessages: number;
}

export function SystemOverview({ 
  totalDownloads, 
  averageRating, 
  newsletterSubscribers, 
  pendingMessages 
}: SystemOverviewProps) {
  const overviewItems = [
    {
      title: "Tổng tải xuống",
      value: totalDownloads.toLocaleString(),
      icon: Download,
      gradient: "from-stone-500 to-stone-600",
    },
    {
      title: "Đánh giá trung bình",
      value: averageRating.toFixed(1),
      icon: Star,
      gradient: "from-stone-600 to-stone-700",
    },
    {
      title: "Newsletter",
      value: newsletterSubscribers.toLocaleString(),
      icon: Mail,
      gradient: "from-stone-700 to-stone-800",
    },
    {
      title: "Tin nhắn mới",
      value: pendingMessages.toLocaleString(),
      icon: MessageSquare,
      gradient: "from-stone-800 to-stone-900",
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Tổng quan hệ thống
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {overviewItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-2xl font-bold text-primary">{item.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
