import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/profile-client";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  // Mock data - trong thực tế sẽ fetch từ database
  const stats = {
    totalOrders: 12,
    totalSpent: 2350000,
    downloads: 45,
    wishlist: 8,
    reviews: 5,
    averageRating: 4.8,
    memberSince: "2024-01-15"
  };

  const recentOrders = [
    {
      id: "ORD-001",
      title: "E-commerce Website Complete",
      date: "2024-01-20",
      price: 499000,
      status: "completed",
      downloaded: true
    },
    {
      id: "ORD-002", 
      title: "Social Media App",
      date: "2024-01-18",
      price: 799000,
      status: "completed",
      downloaded: false
    },
    {
      id: "ORD-003",
      title: "Learning Management System",
      date: "2024-01-15",
      price: 1299000,
      status: "processing",
      downloaded: false
    }
  ];

  const wishlistItems = [
    {
      id: "1",
      title: "Restaurant Management System",
      price: 899000,
      image: "/products/restaurant.jpg"
    },
    {
      id: "2",
      title: "Real Estate Platform",
      price: 1199000,
      image: "/products/realestate.jpg"
    }
  ];

  return (
    <ProfileClient 
      user={user}
      stats={stats}
      recentOrders={recentOrders}
      wishlistItems={wishlistItems}
    />
  );
}
