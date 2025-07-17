"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ProfileHeader, 
  ProfileStats, 
  ProfileOverview, 
  ProfileOrders, 
  ProfileWishlist, 
  ProfileSettings 
} from "@/components/profile";

interface ProfileClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    downloads: number;
    wishlist: number;
    reviews: number;
    averageRating: number;
    memberSince: string;
  };
  recentOrders: Array<{
    id: string;
    title: string;
    date: string;
    price: number;
    status: string;
    downloaded?: boolean;
  }>;
  wishlistItems: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
  }>;
}

export function ProfileClient({ user, stats, recentOrders, wishlistItems }: ProfileClientProps) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <ProfileHeader user={user} stats={stats} />
            <ProfileStats stats={stats} />

            <Tabs defaultValue={defaultTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                <TabsTrigger value="wishlist">Yêu thích</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <ProfileOverview 
                  recentOrders={recentOrders}
                  stats={stats}
                />
              </TabsContent>

              <TabsContent value="orders">
                <ProfileOrders orders={recentOrders} />
              </TabsContent>

              <TabsContent value="wishlist">
                <ProfileWishlist items={wishlistItems} />
              </TabsContent>

              <TabsContent value="settings">
                <ProfileSettings user={user} stats={stats} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 