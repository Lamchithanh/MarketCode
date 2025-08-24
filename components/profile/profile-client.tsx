"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { ProfileDownloads } from "@/components/profile/profile-downloads";
import { GitCodeManager } from "@/components/profile/gitcode";
import { useUser } from '@/hooks/use-user';

interface ProfileClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: string;
  };
}

export function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTab = searchParams.get('tab') || 'overview';
  const { user, refreshUser } = useUser();
  
  // Use live user data if available, fallback to initial props
  const profileUser = user || initialUser;
  
  // Fetch real stats from API
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    downloads: 0,
    wishlist: 0,
    reviews: 0,
    averageRating: 0,
    memberSince: ""
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  
  const fetchProfileData = useCallback(async (forceRefresh = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    // Skip if already fetched unless forced
    if (dataFetched && !forceRefresh) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch user stats
      const [statsResponse, ordersResponse] = await Promise.all([
        fetch('/api/user/stats'),
        fetch('/api/orders')
      ]);
      
      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        if (statsResult.success) {
          setStats(statsResult.data);
        }
      }
      
      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        if (ordersResult.success) {
          // Get only recent orders (last 3)
          const recent = ordersResult.data.slice(0, 3);
          setRecentOrders(recent);
        }
      }
      
      setDataFetched(true);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, dataFetched]);

  const handleProfileUpdate = async () => {
    try {
      // Only refresh user data and stats, no need to refresh entire page
      await refreshUser();
      await fetchProfileData(true); // Force refresh with updated data
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
  };
  
  useEffect(() => {
    if (user?.id) {
      if (!dataFetched) {
        fetchProfileData();
      }
    } else {
      // Reset state when user is not available
      setDataFetched(false);
      setLoading(true);
    }
  }, [user?.id]); // Only depend on user id, not the function

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Đang tải thông tin...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <ProfileHeader 
              user={profileUser} 
              stats={stats}
              onUpdateProfile={handleProfileUpdate}
            />
            <ProfileStats stats={stats} />

            <Tabs defaultValue={defaultTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                <TabsTrigger value="downloads">Tải xuống</TabsTrigger>
                <TabsTrigger value="gitcode">GitCode</TabsTrigger>
                <TabsTrigger value="wishlist">Yêu thích</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <ProfileOverview 
                  recentOrders={recentOrders}
                  stats={stats}
                  user={profileUser}
                />
              </TabsContent>

              <TabsContent value="orders">
                <ProfileOrders />
              </TabsContent>

              <TabsContent value="downloads">
                <ProfileDownloads />
              </TabsContent>

              <TabsContent value="gitcode">
                <GitCodeManager />
              </TabsContent>

              <TabsContent value="wishlist">
                <ProfileWishlist />
              </TabsContent>

              <TabsContent value="settings">
                <ProfileSettings user={profileUser} stats={stats} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 