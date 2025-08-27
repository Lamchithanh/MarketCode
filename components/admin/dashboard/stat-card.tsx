import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isUpdated?: boolean;
  highlightDuration?: number;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  bgColor = "bg-stone-100", 
  iconColor = "text-stone-600",
  trend,
  isUpdated = false,
  highlightDuration = 5000
}: StatCardProps) {
  const [showHighlight, setShowHighlight] = useState(false);

  useEffect(() => {
    if (isUpdated) {
      setShowHighlight(true);
      const timer = setTimeout(() => {
        setShowHighlight(false);
      }, highlightDuration);

      return () => clearTimeout(timer);
    }
  }, [isUpdated, highlightDuration]);

  const cardClasses = `
    border-0 shadow-lg hover:shadow-xl transition-all duration-300
    ${showHighlight ? 'ring-2 ring-blue-500 ring-opacity-75 animate-pulse' : ''}
    ${showHighlight ? 'bg-blue-50/30' : ''}
  `;

  return (
    <Card className={cardClasses}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
          {showHighlight && (
            <span className="ml-2 inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
        </CardTitle>
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center transition-all duration-300 ${showHighlight ? 'scale-110' : ''}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold transition-all duration-300 ${showHighlight ? 'text-blue-600' : 'text-foreground'}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
          {showHighlight && (
            <span className="ml-2 text-xs font-normal text-blue-500 animate-bounce">
              ✨ Mới cập nhật
            </span>
          )}
        </div>
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}
          </p>
        )}
        {!trend && (
          <p className={`text-xs mt-1 transition-colors duration-300 ${showHighlight ? 'text-blue-600' : 'text-stone-600'}`}>
            {showHighlight ? 'Vừa cập nhật' : 'Cập nhật gần đây'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
