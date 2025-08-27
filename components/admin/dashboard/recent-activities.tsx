import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShoppingCart, Package, Users, Star, Download, LucideIcon } from "lucide-react";

interface RecentActivityItem {
  id: string;
  type: 'order' | 'product' | 'user' | 'review' | 'download';
  message: string;
  time: string;
  metadata?: Record<string, unknown>;
}

interface RecentActivitiesProps {
  activities: RecentActivityItem[];
}

const activityIcons: Record<string, LucideIcon> = {
  order: ShoppingCart,
  product: Package,
  user: Users,
  review: Star,
  download: Download,
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type] || Activity;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có hoạt động nào</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
