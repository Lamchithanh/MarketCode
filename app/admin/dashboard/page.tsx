"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield, Users, Package, ShoppingCart, DollarSign, TrendingUp, Activity, Star, Download, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/loader";

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <PageLoader text="Đang tải admin dashboard..." size="2xl" />;
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Total Products",
      value: "567",
      icon: Package,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Today's Orders",
      value: "89",
      icon: ShoppingCart,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Monthly Revenue",
      value: "$12,345",
      icon: DollarSign,
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create new product for marketplace",
      icon: Package,
      href: "/admin/products",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Manage Orders",
      description: "View and process new orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Check Performance",
      description: "Monitor system performance",
      icon: Activity,
      href: "/admin/performance",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
    {
      title: "Manage Users",
      description: "Manage user accounts",
      icon: Users,
      href: "/admin/users",
      bgColor: "bg-stone-100",
      iconColor: "text-stone-600",
    },
  ];

  const recentActivities = [
    {
      type: "order",
      message: "Đơn hàng mới #ORD-001 từ user@example.com",
      time: "2 phút trước",
      icon: ShoppingCart,
    },
    {
      type: "product",
      message: "Sản phẩm 'React Admin Dashboard' đã được thêm",
      time: "15 phút trước",
      icon: Package,
    },
    {
      type: "user",
      message: "Người dùng mới đã đăng ký: john@example.com",
      time: "1 giờ trước",
      icon: Users,
    },
    {
      type: "review",
      message: "Đánh giá 5 sao cho sản phẩm 'Vue.js Template'",
      time: "2 giờ trước",
      icon: Star,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage your MarketCode platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-stone-600">
                  Updated recently
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className="group p-4 rounded-lg border border-border/40 hover:border-stone-400/40 transition-all duration-200 hover:shadow-md"
                  >
                    <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-stone-600 transition-colors duration-200">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card className="mt-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Tổng tải xuống</h3>
              <p className="text-2xl font-bold text-primary">45,678</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Đánh giá trung bình</h3>
              <p className="text-2xl font-bold text-primary">4.8</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Newsletter</h3>
              <p className="text-2xl font-bold text-primary">2,345</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Tin nhắn mới</h3>
              <p className="text-2xl font-bold text-primary">12</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
