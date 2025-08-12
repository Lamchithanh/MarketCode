# 🚀 HƯỚNG DẪN CHUYỂN SANG SUPABASE

## 📋 **TỔNG QUAN**
Dự án hiện đang sử dụng **Prisma + PostgreSQL**. Hướng dẫn này sẽ giúp bạn migrate sang **Supabase**.

### **Các bảng hiện tại cần migrate:**
- ✅ **User Management:** User, VerificationCode, RefreshToken
- ✅ **Product System:** Product, Category, Tag, ProductTag
- ✅ **E-commerce:** Order, OrderItem, Cart, Wishlist, Review, Download
- ✅ **System:** Coupon, Newsletter, ContactMessage, SystemSetting

---

## 🔧 **BƯỚC 1: THIẾT LẬP SUPABASE**

### 1.1. Cấu hình Environment Variables
```bash
# Tạo file .env.local từ template
cp env.template .env.local
```

### 1.2. Điền thông tin Supabase vào .env.local:
```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.tpatqvqlfklagdkxeqpt.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR_PASSWORD]@db.tpatqvqlfklagdkxeqpt.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://tpatqvqlfklagdkxeqpt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="[GET_FROM_DASHBOARD]"
```

### 1.3. Lấy thông tin từ Supabase Dashboard:
1. **Database Password:** Dashboard > Settings > Database > Database password
2. **Service Role Key:** Dashboard > Settings > API > service_role key

---

## 🏗️ **BƯỚC 2: MIGRATION DATABASE**

### 2.1. Chạy SQL Migration Script
1. Mở **Supabase Dashboard** > SQL Editor
2. Copy nội dung từ file `supabase-migration.sql`
3. Chạy script để tạo tất cả bảng

### 2.2. Verify Migration
```sql
-- Kiểm tra các bảng đã tạo
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Kiểm tra ENUM types
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'Role'::regtype;
```

---

## 📦 **BƯỚC 3: CẬP NHẬT DEPENDENCIES**

### 3.1. Cài đặt Supabase Client
```bash
npm install @supabase/supabase-js
# hoặc
pnpm add @supabase/supabase-js
```

### 3.2. Cập nhật Prisma Schema
```bash
# Generate lại Prisma client với connection mới
npx prisma generate

# Push schema lên Supabase (nếu cần)
npx prisma db push
```

---

## 🔄 **BƯỚC 4: CẬP NHẬT CODE**

### 4.1. Thay thế Prisma Client
**Trước (Prisma):**
```typescript
import { prisma } from "@/lib/prisma";
const users = await prisma.user.findMany();
```

**Sau (Supabase + Prisma):**
```typescript
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma"; // Vẫn sử dụng với connection mới

// Dùng Prisma với Supabase connection
const users = await prisma.user.findMany();

// Hoặc dùng Supabase client trực tiếp
const { data: users } = await supabase
  .from('User')
  .select('*');
```

### 4.2. Authentication Migration
Có thể sử dụng:
- **NextAuth.js** (hiện tại) với Supabase database
- **Supabase Auth** (thay thế hoàn toàn)

---

## ✅ **BƯỚC 5: TESTING & DEPLOYMENT**

### 5.1. Test Local
```bash
npm run dev
# Kiểm tra kết nối database
```

### 5.2. Data Migration (nếu có data cũ)
```sql
-- Export từ database cũ
-- Import vào Supabase thông qua Dashboard > Table Editor
```

### 5.3. Row Level Security (Optional)
```sql
-- Enable RLS cho bảng User
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho user chỉ thấy data của mình
CREATE POLICY "Users can view own data" ON "User"
FOR SELECT USING (auth.uid()::text = id);
```

---

## 🚨 **LƯU Ý QUAN TRỌNG**

### ⚠️ **Backup Data:**
- Export toàn bộ data từ database cũ trước khi migrate

### 🔐 **Security:**
- Đổi tất cả passwords và API keys
- Cấu hình RLS policies cho production
- Kiểm tra permissions của các bảng

### 🧪 **Testing:**
- Test toàn bộ chức năng sau khi migrate
- Kiểm tra authentication flow
- Verify file upload/download

---

## 📚 **TÀI LIỆU THAM KHẢO**
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**🎉 Sau khi hoàn thành, bạn sẽ có một ứng dụng MarketCode chạy hoàn toàn trên Supabase!**
