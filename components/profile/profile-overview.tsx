import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Trophy, CheckCircle2, Clock, Gift, Copy, Star, Heart, Award, Target, Zap, User, Code } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface ProfileOverviewProps {
  recentOrders: Array<{
    id: string;
    orderNumber?: string;
    totalAmount: number;  
    createdAt: string;    
    status: string;
    items?: Array<{
      productTitle: string;
    }>;
  }>;
  stats: {
    totalOrders: number;
    totalSpent: number;
    downloads: number;
    wishlist: number;
    reviews: number;
    averageRating: number;
    memberSince: string;
    cartItems: number;
    productShares: number;
    gitCodeUsages: number;
  };
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    emailVerified?: string | null;
  };
}

interface CompletionStatus {
  percentage: number;
  isCompleted: boolean;
  missingFields?: string[];
  reward?: {
    message: string;
    couponCode: string;
    isClaimed: boolean;
  };
}

export function ProfileOverview({ recentOrders, stats, user }: ProfileOverviewProps) {
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);

  // Fetch completion status 
  const fetchCompletionStatus = useCallback(async () => {
    try {
      // Only fetch account progress for now
      const progressResponse = await fetch('/api/user/account-progress');
      
      if (progressResponse.ok) {
        const progressResult = await progressResponse.json();
        if (progressResult.success) {
          // Check profile completion based on user data
          const hasBasicProfile = user.name && user.email && user.avatar;
          if (hasBasicProfile) {
            setCompletionStatus({
              percentage: 100,
              isCompleted: true,
              reward: {
                message: "Chúc mừng! Bạn đã hoàn thành hồ sơ cá nhân!",
                couponCode: "PROFILE10",
                isClaimed: false
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching completion status:', error);
    }
  }, [user.name, user.email, user.avatar]);

  // Claim reward
  const claimReward = async () => {
    // For now, just set as claimed locally
    setIsClaimed(true);
    toast.success('🎉 Chúc mừng! Đã nhận mã giảm giá thành công!');
    
    // Update completion status to mark as claimed
    if (completionStatus) {
      setCompletionStatus({
        ...completionStatus,
        reward: completionStatus.reward ? {
          ...completionStatus.reward,
          isClaimed: true
        } : undefined
      });
    }
  };

  // Copy coupon code
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép mã giảm giá!');
  };

  useEffect(() => {
    fetchCompletionStatus();
  }, [user, fetchCompletionStatus]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "processing":
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate focused 5-task account progress
  const calculateAccountProgress = () => {
    let totalPoints = 0;
    const maxPoints = 100;
    const achievements: Array<{
      key: string;
      label: string;
      points: number;
      completed: boolean;
      requiresPurchase: boolean;
      icon: string;
      hint: string;
    }> = [];

    // 5 focused tasks (20 points each)
    const focusedTasks = [
      { 
        key: 'avatar', 
        label: 'Cập nhật hình ảnh đại diện', 
        points: 20, 
        completed: !!user.avatar, 
        requiresPurchase: false,
        icon: 'User',
        hint: 'Thêm ảnh để cá nhân hóa tài khoản'
      },
      { 
        key: 'cart', 
        label: 'Thêm sản phẩm vào giỏ hàng', 
        points: 20, 
        completed: stats.cartItems > 0, 
        requiresPurchase: false,
        icon: 'ShoppingCart',
        hint: 'Khám phá và thêm sản phẩm yêu thích vào giỏ hàng'
      },
      { 
        key: 'review', 
        label: 'Đánh giá sản phẩm', 
        points: 20, 
        completed: stats.reviews > 0, 
        requiresPurchase: true,
        icon: 'Star',
        hint: 'Nhanh tay đánh giá 1 Project tuyệt vời nào!'
      },
      { 
        key: 'share', 
        label: 'Chia sẻ 1 sản phẩm', 
        points: 20, 
        completed: stats.productShares > 0, 
        requiresPurchase: false,
        icon: 'Heart',
        hint: 'Chia sẻ sản phẩm hay với bạn bè'
      },
      { 
        key: 'gitcode', 
        label: 'Nhập 1 GitCode', 
        points: 20, 
        completed: stats.gitCodeUsages > 0, 
        requiresPurchase: false,
        icon: 'Code',
        hint: 'Nhập mã GitCode để truy cập tài nguyên đặc biệt'
      }
    ];

    const allFields = [...focusedTasks];
    
    allFields.forEach(field => {
      if (field.completed) {
        totalPoints += field.points;
        achievements.push(field);
      }
    });

    const percentage = Math.min(Math.round((totalPoints / maxPoints) * 100), 100);
    const pendingFields = allFields.filter(f => !f.completed);

    return {
      percentage,
      totalPoints,
      maxPoints,
      achievements,
      pendingFields,
      isFullyCompleted: percentage === 100
    };
  };

  const accountProgress = calculateAccountProgress();
  
  // Profile completion for reward system (original logic)
  const isProfileCompleted = completionStatus?.isCompleted || false;
  const reward = completionStatus?.reward;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Recent Orders */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Đơn hàng gần đây
          </CardTitle>
          <CardDescription>
            Các đơn hàng mới nhất của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {order.items?.[0]?.productTitle || `Đơn hàng #${order.orderNumber?.slice(-6)}`}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(order.totalAmount || 0)}</p>
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/profile?tab=orders">Xem tất cả đơn hàng</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Account Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Tiến độ tài khoản
            {accountProgress.isFullyCompleted && <Badge variant="secondary" className="bg-gold-100 text-gold-700">🏆 Hoàn hảo</Badge>}
          </CardTitle>
          <CardDescription>
            Hoàn thành 5 nhiệm vụ đơn giản để nâng cấp tài khoản (mỗi nhiệm vụ 20 điểm)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Overview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tiến độ tổng thể</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{accountProgress.totalPoints}/{accountProgress.maxPoints} điểm</span>
                  <span className="text-sm font-bold text-primary">{accountProgress.percentage}%</span>
                </div>
              </div>
              <Progress value={accountProgress.percentage} className="h-3" />
            </div>

            {/* Achievement Badges */}
            {accountProgress.achievements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-700 flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Thành tích đã đạt được ({accountProgress.achievements.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {accountProgress.achievements.map((achievement) => (
                    <Badge 
                      key={achievement.key} 
                      variant="secondary" 
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {achievement.label} (+{achievement.points})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Missions */}
            {accountProgress.pendingFields.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-700 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Nhiệm vụ chưa hoàn thành ({accountProgress.pendingFields.length})
                </h4>
                <div className="space-y-3">
                  {accountProgress.pendingFields.slice(0, 5).map((field) => {
                    const getFieldIcon = (iconName: string) => {
                      switch(iconName) {
                        case 'User': return <User className="h-4 w-4" />;
                        case 'ShoppingCart': return <ShoppingCart className="h-4 w-4" />;
                        case 'Star': return <Star className="h-4 w-4" />;
                        case 'Heart': return <Heart className="h-4 w-4" />;
                        case 'Code': return <Code className="h-4 w-4" />;
                        default: return <Zap className="h-4 w-4" />;
                      }
                    };

                    // All tasks have equal importance (20 points each)
                    const isHighValue = field.points >= 20;

                    return (
                      <div 
                        key={field.key} 
                        className={`p-3 rounded-lg border ${
                          isHighValue 
                            ? 'border-orange-200 bg-orange-50/50' 
                            : 'border-gray-200 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFieldIcon(field.icon)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{field.label}</span>
                                <Badge 
                                  variant="outline" 
                                  className={isHighValue ? 'border-orange-300 text-orange-700' : 'border-blue-300 text-blue-700'}
                                >
                                  +{field.points} điểm
                                </Badge>
                                {/* {field.requiresPurchase && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                                    Cần mua hàng
                                  </Badge>
                                )} */}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {field.hint}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {accountProgress.pendingFields.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      và {accountProgress.pendingFields.length - 5} nhiệm vụ khác...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Profile Completion Reward - Only show if not VIP yet */}
            {isProfileCompleted && reward && accountProgress.percentage < 100 && (
              <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-800">🎁 Phần thưởng hồ sơ hoàn thiện!</h4>
                </div>
                
                <p className="text-sm text-green-700 mb-3">
                  {reward.message}
                </p>

                {!isClaimed ? (
                  <Button 
                    onClick={claimReward}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Nhận ngay mã giảm giá!
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-bold text-green-800">
                          {reward.couponCode}
                        </code>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          10% OFF
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(reward.couponCode)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIP Status or Tier System Preview */}
            {accountProgress.percentage === 100 ? (
              <div className="mt-4 p-3 bg-gradient-to-r from-gold-50 to-yellow-50 border border-gold-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-gold-600" />
                  <h4 className="font-medium text-gold-800">🏆 Chúc mừng Thành viên VIP!</h4>
                </div>
                <p className="text-sm text-gold-700">
                  Bạn đã hoàn thành tất cả nhiệm vụ! Hãy tiếp tục khám phá những sản phẩm tuyệt vời và nhận thêm nhiều ưu đãi độc quyền.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-gold-200 text-gold-700 hover:bg-gold-50"
                  size="sm"
                  asChild
                >
                  <Link href="/products">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Khám phá sản phẩm VIP
                  </Link>
                </Button>
              </div>
            ) : accountProgress.percentage >= 60 ? (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-purple-800">🚀 Sắp lên hạng!</h4>
                </div>
                <p className="text-sm text-purple-700">
                  Chỉ còn {100 - accountProgress.percentage}% nữa để trở thành <strong>Thành viên VIP</strong> và nhận nhiều ưu đãi độc quyền!
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                  size="sm"
                  asChild
                >
                  <Link href="/products">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Khám phá sản phẩm
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 