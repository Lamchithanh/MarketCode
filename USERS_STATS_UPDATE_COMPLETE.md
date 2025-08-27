# Users Stats - Deleted Users Display Update

## ✅ **Cập nhật hoàn thành**

### **Yêu cầu:** 
Hiển thị số lượng người dùng đã xóa bên dưới card "Total Users" thay vì tạo card riêng.

### **Thay đổi thực hiện:**

#### **1. Cập nhật UserStats Component (users-stats.tsx)**

**Trước:**
```tsx
// Có 5 cards riêng biệt bao gồm "Deleted Users" card
const statsData = [
  { title: 'Total Users', value: stats.total, ... },
  { title: 'Deleted Users', value: stats.deletedUsers, ... }, // Card riêng
  { title: 'Admin Users', value: stats.admins, ... },
  // ...
];
```

**Sau:**
```tsx
// Chỉ có 4 cards, deleted users hiển thị dưới Total Users
const statsData = [
  { 
    title: 'Total Users', 
    value: stats.total,
    secondaryValue: `${stats.deletedUsers || 0} đã xóa`, // Thông tin phụ
    ... 
  },
  { title: 'Admin Users', value: stats.admins, ... },
  // ...
];
```

#### **2. Enhanced Card Display**

**Card "Total Users" bây giờ hiển thị:**
```
┌──────────────────────┐
│ 👥 Total Users       │
│                      │
│ 6                    │ ← Số chính
│ 3 đã xóa             │ ← Thông tin phụ màu đỏ  
│ Total count          │
└──────────────────────┘
```

#### **3. Code Implementation**

**Card Content với Secondary Value:**
```tsx
<CardContent>
  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
  {stat.secondaryValue && (
    <p className="text-sm text-red-600 mt-1">{stat.secondaryValue}</p>
  )}
  <p className="text-xs text-stone-600">
    {stat.title === 'Recent Users' ? 'Last 30 days' : 'Total count'}
  </p>
</CardContent>
```

### **4. Layout Updates:**

- **Grid Layout**: Từ `lg:grid-cols-5` về `lg:grid-cols-4` (4 cards thay vì 5)
- **Loading State**: Hiển thị 4 skeleton cards
- **No Data State**: Hiển thị 4 placeholder cards

### **5. UserStats Interface:**

Interface UserStats đã có sẵn field `deletedUsers`:
```typescript
export interface UserStats {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  regular: number;
  recent: number;
  buyers: number;
  deletedUsers: number; // ✅ Đã có sẵn
}
```

### **6. Data Source:**

UserService đã được cập nhật để đếm deleted users:
```typescript
const { count: deletedUsers } = await supabaseServiceRole
  .from('User')
  .select('*', { count: 'exact', head: true })
  .not('deletedAt', 'is', null);

return {
  // ... other stats
  deletedUsers: deletedUsers || 0
};
```

## 🎯 **Kết quả:**

### **UI/UX Improvements:**
- ✅ **Tiết kiệm không gian**: 4 cards thay vì 5 cards
- ✅ **Thông tin tập trung**: Deleted users gắn liền với Total users
- ✅ **Visual hierarchy**: Số chính (6) và thông tin phụ (3 đã xóa)
- ✅ **Color coding**: Text đỏ để nhấn mạnh deleted users

### **Data Display:**
- ✅ **Total Users**: 6 (số người dùng hoạt động)
- ✅ **Deleted Count**: "3 đã xóa" (màu đỏ, bên dưới số chính)
- ✅ **Real-time Updates**: Tự động cập nhật khi có thay đổi

### **Technical Benefits:**
- ✅ **Clean Interface**: Không tạo card riêng cho deleted users
- ✅ **Better UX**: Thông tin liên quan được nhóm lại
- ✅ **Consistent Styling**: Sử dụng hệ thống màu sắc nhất quán
- ✅ **Responsive Design**: Hoạt động tốt trên mọi screen size

## 🚀 **Status:**

**HOÀN THÀNH** - Users stats page giờ hiển thị số lượng deleted users bên dưới Total Users card thay vì tạo card riêng, đúng như yêu cầu!

Truy cập `/admin/users` để xem kết quả cập nhật! 🎉
