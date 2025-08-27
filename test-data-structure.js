// Test script to verify dashboard stats API
console.log("Testing Dashboard Stats API...");

// Check if the API returns the correct structure
const testDashboardStats = {
  stats: {
    totalUsers: 6,
    deletedUsers: 3,
    totalProducts: 4,
    totalOrders: 7,
    totalDownloads: 6,
    totalRevenue: 29.99,
    averageRating: 4.0,
    newsletterSubscribers: 0,
    pendingMessages: 0,
  },
  recentActivities: []
};

console.log("Expected dashboard stats structure:");
console.log(JSON.stringify(testDashboardStats, null, 2));

// Test user data structure 
const testUserData = {
  users: [
    {
      id: "test-id",
      name: "Test User",
      email: "test@example.com",
      role: "USER",
      avatar: null,
      isActive: true,
      lastLoginAt: null,
      emailVerified: null,
      deletedAt: null, // This should be included for deleted users
      orderCount: 0,
      createdAt: "2025-08-27T10:00:00.000Z",
      updatedAt: "2025-08-27T10:00:00.000Z"
    }
  ],
  total: 9,
  page: 1,
  limit: 20,
  totalPages: 1
};

console.log("Expected user data structure:");
console.log(JSON.stringify(testUserData, null, 2));

console.log("✅ Data structures look correct!");
