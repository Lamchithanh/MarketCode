import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  bgColor?: string;
  iconColor?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Thao tác nhanh
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group p-4 rounded-lg border border-border/40 hover:border-stone-400/40 transition-all duration-200 hover:shadow-md"
              >
                <div className={`w-12 h-12 ${action.bgColor || 'bg-stone-100'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-6 w-6 ${action.iconColor || 'text-stone-600'}`} />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-stone-600 transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
