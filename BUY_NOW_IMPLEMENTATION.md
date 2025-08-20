# Chức Năng "Mua Ngay" (Buy Now) - Implementation Guide

## Tổng Quan

Chức năng "Mua Ngay" cho phép người dùng mua sản phẩm trực tiếp mà không cần thêm vào giỏ hàng. Tính năng này được tích hợp hoàn toàn với database và hỗ trợ các tính năng nâng cao.

## 🚀 Các Tính Năng Chính

### 1. **Mua Ngay Trực Tiếp**
- ✅ Mua sản phẩm ngay lập tức với 1 click
- ✅ Bỏ qua bước thêm vào giỏ hàng
- ✅ Chuyển thẳng đến trang thanh toán

### 2. **Xác Thực & Bảo Mật**
- ✅ Xác thực user đã đăng nhập
- ✅ Kiểm tra sản phẩm còn hoạt động
- ✅ Ngăn người dùng mua sản phẩm của chính họ
- ✅ Xác thực tất cả dữ liệu đầu vào

### 3. **Hỗ Trợ Coupon**
- ✅ Áp dụng mã giảm giá tự động
- ✅ Hỗ trợ coupon loại % và số tiền cố định
- ✅ Kiểm tra hạn sử dụng và số lần sử dụng
- ✅ Cập nhật số lần sử dụng tự động

### 4. **Đa Phương Thức Thanh Toán**
- ✅ Bank Transfer (Chuyển khoản)
- ✅ PayPal
- ✅ Stripe (Credit/Debit Cards)
- ✅ MoMo Wallet
- ✅ ZaloPay

### 5. **Quản Lý Order**
- ✅ Tạo order tự động với OrderItem
- ✅ Sinh mã order unique
- ✅ Theo dõi trạng thái thanh toán
- ✅ Xóa sản phẩm khỏi giỏ hàng sau khi mua

## 🏗️ Cấu Trúc Implementation

### API Endpoints

#### `POST /api/orders/buy-now`
Tạo order mới từ việc mua ngay
```json
{
  "productId": "string",
  "userId": "string", 
  "paymentMethod": "bank_transfer | paypal | stripe | momo | zalopay",
  "couponCode": "string? (optional)",
  "notes": "string? (optional)"
}
```

#### `GET /api/orders/buy-now`
Kiểm tra khả năng mua sản phẩm
```json
{
  "productId": "string",
  "userId": "string"
}
```

### Database Schema

#### Order Table
```sql
- id: UUID (PK)
- orderNumber: string (unique)
- buyerId: UUID (FK -> User.id)
- totalAmount: numeric
- discountAmount: numeric
- status: enum (PENDING, PROCESSING, COMPLETED, CANCELLED)
- paymentMethod: string
- paymentStatus: enum (PENDING, PAID, FAILED, REFUNDED)
- notes: text
- createdAt: timestamp
```

#### OrderItem Table
```sql
- id: UUID (PK)
- orderId: UUID (FK -> Order.id)
- productId: UUID (FK -> Product.id)
- productTitle: string
- productPrice: numeric
- snapshotUrl: string?
```

#### Coupon Table
```sql
- code: string (unique)
- type: 'percentage' | 'fixed'
- value: numeric
- minAmount: numeric?
- maxAmount: numeric?
- usageLimit: integer?
- usageCount: integer
- validFrom: timestamp
- validUntil: timestamp
```

### Components

#### `BuyNowButton`
- Component chính cho nút "Mua Ngay"
- Dialog xác nhận với form thanh toán
- Tích hợp với authentication và validation
- Location: `components/products/buy-now-button.tsx`

#### `CheckoutPage`
- Trang checkout để xử lý thanh toán
- Hiển thị thông tin order và payment
- Demo payment simulation
- Location: `app/checkout/[orderId]/page.tsx`

### Hooks

#### `useBuyNow`
- Hook quản lý logic mua ngay
- API calls và error handling
- Loading states và notifications
- Location: `hooks/use-buy-now.ts`

#### `useUser`
- Hook lấy thông tin user từ session
- Authentication status
- Location: `hooks/use-user.ts`

## 🔄 Flow Hoạt Động

### 1. User Click "Mua Ngay"
```
1. Check authentication status
2. Verify product availability 
3. Open confirmation dialog
```

### 2. Confirm Purchase
```
1. Select payment method
2. Enter optional coupon code
3. Add notes if needed
4. Click "Confirm Purchase"
```

### 3. Create Order
```
1. Validate all inputs
2. Check product and user status
3. Process coupon if provided
4. Create Order + OrderItem
5. Update coupon usage count
6. Remove from cart if exists
```

### 4. Redirect to Checkout
```
1. Redirect to /checkout/[orderId]
2. Display order summary
3. Show payment options
4. Process payment (demo)
```

## 🧪 Testing

### API Testing Examples

#### Test Buy Now (PowerShell)
```powershell
$body = @{
    productId = "629f09a3-8942-4f15-bc3e-a24b82a603b7"
    userId = "14db1798-c036-4a58-a2d0-4beafded88e2"
    paymentMethod = "bank_transfer"
    notes = "Test order"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/orders/buy-now" -Method POST -Body $body -ContentType "application/json"
```

#### Test with Coupon
```powershell
$body = @{
    productId = "629f09a3-8942-4f15-bc3e-a24b82a603b7"
    userId = "14db1798-c036-4a58-a2d0-4beafded88e2"
    paymentMethod = "paypal"
    couponCode = "DISCOUNT10"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/orders/buy-now" -Method POST -Body $body -ContentType "application/json"
```

#### Test Availability Check
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/orders/buy-now?productId=629f09a3-8942-4f15-bc3e-a24b82a603b7&userId=14db1798-c036-4a58-a2d0-4beafded88e2" -Method GET
```

### Database Verification

#### Check Created Orders
```sql
SELECT o.*, oi."productTitle", oi."productPrice" 
FROM "Order" o 
LEFT JOIN "OrderItem" oi ON o.id = oi."orderId" 
WHERE o."createdAt" >= NOW() - INTERVAL '1 hour'
ORDER BY o."createdAt" DESC;
```

#### Check Coupon Usage
```sql
SELECT code, name, "usageCount", "usageLimit" 
FROM "Coupon" 
WHERE code = 'DISCOUNT10';
```

## 🔧 Configuration

### Environment Setup
Đảm bảo có các biến môi trường cần thiết:
- Supabase URL và Service Role Key
- NextAuth configuration
- Payment gateway credentials (for production)

### Payment Methods
Hiện tại hỗ trợ demo cho tất cả payment methods. Trong production cần tích hợp:
- Stripe API
- PayPal SDK
- MoMo/ZaloPay API
- Bank transfer instructions

## 🚨 Error Handling

### API Error Responses
- `400`: Missing required fields hoặc validation failed
- `404`: Product không tồn tại hoặc user không tồn tại  
- `401`: User không được phép mua sản phẩm của chính họ
- `500`: Server error

### Frontend Error Handling
- Toast notifications cho user feedback
- Loading states during API calls
- Form validation trước khi submit
- Graceful fallback cho network errors

## 🎯 Usage trong UI

### Product Page Integration
```tsx
import { BuyNowButton } from "@/components/products/buy-now-button";

<BuyNowButton 
  product={{
    id: product.id,
    title: product.title,
    price: product.price,
  }}
  className="w-full text-lg font-semibold"
  size="lg"
/>
```

### Custom Styling
Component hỗ trợ tất cả props của Button component và có thể customize:
- `variant`: button variant
- `size`: button size  
- `className`: additional CSS classes

## ✅ Kết Quả Testing

### Successful Tests
1. ✅ **Basic Buy Now**: Tạo order thành công với bank_transfer
2. ✅ **Coupon Integration**: Áp dụng DISCOUNT10 (10% off) thành công
3. ✅ **Database Consistency**: Order, OrderItem, và Coupon usage được update đúng
4. ✅ **Availability Check**: API trả về đúng thông tin product và payment methods
5. ✅ **Error Validation**: Xử lý đúng các trường hợp lỗi

### Sample Test Results
```json
// Buy Now Response
{
  "success": true,
  "order": {
    "id": "3b22b054-cf73-4dc4-bd71-e794bacaa556",
    "orderNumber": "ORD-1755620316679-GXF", 
    "totalAmount": 24.99,
    "originalAmount": 24.99,
    "discountAmount": 0,
    "paymentMethod": "bank_transfer",
    "paymentStatus": "PENDING"
  }
}

// With Coupon Response
{
  "success": true,
  "order": {
    "totalAmount": 22.49,
    "originalAmount": 24.99,
    "discountAmount": 2.50
  },
  "coupon": {
    "code": "DISCOUNT10",
    "discountApplied": 2.50
  }
}
```

## 🔮 Future Enhancements

### Planned Features
1. **Real Payment Integration**: Tích hợp API thực với các payment gateway
2. **Inventory Management**: Kiểm tra tồn kho trước khi bán
3. **Bulk Purchase**: Mua nhiều sản phẩm cùng lúc
4. **Subscription Products**: Hỗ trợ sản phẩm định kỳ
5. **Advanced Coupons**: Coupon theo category, user group
6. **Order Notifications**: Email và push notifications
7. **Download Management**: Tự động cung cấp download links sau thanh toán

### Technical Improvements
1. **Rate Limiting**: Giới hạn số lượng request
2. **Caching**: Cache product info và user data
3. **Analytics**: Tracking conversion rates
4. **A/B Testing**: Test different checkout flows
5. **Mobile Optimization**: Tối ưu cho mobile users

---

## 📞 Support

Nếu có vấn đề với implementation, kiểm tra:
1. Database connections
2. Environment variables  
3. API endpoint accessibility
4. User authentication status
5. Product availability and permissions

Implementation này đã được test đầy đủ và sẵn sàng cho production với việc tích hợp thêm real payment processors.
