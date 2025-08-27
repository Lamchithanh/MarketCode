# FIXED: Users Stats API - Deleted Users Count

## 🐛 **Vấn đề được phát hiện:**

**Hiện tượng:** Users stats hiển thị "0 đã xóa" thay vì "3 đã xóa" 
**Nguyên nhân:** API `/api/admin/users/stats` không trả về field `deletedUsers`

## 🔍 **Debugging Process:**

### 1. **Database Verification** ✅
```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN "deletedAt" IS NULL THEN 1 END) as active_users,
  COUNT(CASE WHEN "deletedAt" IS NOT NULL THEN 1 END) as deleted_users
FROM "User";
```
**Kết quả:** `deleted_users: 3` - Database đúng!

### 2. **API Response Check** ❌
```javascript
// Test API call showed:
{
  "total": 9,
  "verified": 0,
  "admins": 4,
  // ... other fields
  // ❌ MISSING: deletedUsers field!
}
```

### 3. **Root Cause Discovery** 🎯
- UserService có logic đếm deleted users ✅
- UsersStats component có hiển thị deleted users ✅  
- **API route `/api/admin/users/stats` KHÔNG query deleted users** ❌

## 🔧 **Fixes Applied:**

### **1. Added Deleted Users Query to API:**
```typescript
// app/api/admin/users/stats/route.ts

// Get deleted users count
const { count: deletedUsers, error: deletedUsersError } = await supabaseServiceRole
  .from('User')
  .select('id', { count: 'exact', head: true })
  .not('deletedAt', 'is', null);

if (deletedUsersError) {
  console.error('Error fetching deleted users count:', deletedUsersError);
}

console.log('🔍 Deleted users count from API:', deletedUsers);
```

### **2. Updated API Response:**
```typescript
return NextResponse.json({
  total: totalUsers || 0,
  verified: verifiedUsers || 0,
  unverified: (totalUsers || 0) - (verifiedUsers || 0),
  admins: adminUsers || 0,
  regular: (totalUsers || 0) - (adminUsers || 0),
  recent: recentUsers || 0,
  buyers: uniqueBuyers,
  deletedUsers: deletedUsers || 0  // ✅ ADDED THIS!
});
```

## ✅ **Verification Results:**

### **API Response After Fix:**
```javascript
{
  "total": 9,
  "verified": 0,
  "unverified": 9,
  "admins": 4,
  "regular": 5,
  "recent": 9,
  "buyers": 3,
  "deletedUsers": 3  // ✅ CORRECT!
}
```

### **UI Display Now Shows:**
```
┌─────────────────────┐
│ 👥 Total Users      │
│                     │
│ 9                   │ ← Total including deleted
│ 3 đã xóa            │ ← Deleted users (red text)
│ Total count         │
└─────────────────────┘
```

## 🎯 **Technical Details:**

### **Database Query Used:**
```sql
-- Supabase query equivalent:
SELECT COUNT(id) FROM "User" WHERE "deletedAt" IS NOT NULL;
-- Returns: 3
```

### **API Endpoint:** 
`GET /api/admin/users/stats`

### **Response Field Added:**
`deletedUsers: number` - Count of soft-deleted users

### **UI Component:**
`components/admin/users/users-stats.tsx` - Displays as secondary value under Total Users

## 🚀 **Status: FIXED**

- ✅ **API:** Now returns correct `deletedUsers: 3`
- ✅ **Database:** Verified 3 deleted users exist
- ✅ **UI:** Users stats page shows "3 đã xóa" under Total Users
- ✅ **Real-time:** Updates automatically when users deleted/restored

**The issue has been completely resolved!** 

Users stats now correctly displays "3 đã xóa" instead of "0 đã xóa" 🎉
