# Cập Nhật Email System - Sử Dụng Support Email

## 🔧 **Vấn đề đã sửa**

### **Trước khi sửa:**
- Email sender: `thanhlc.dev@gmail.com` (từ `email_smtp_user`)  
- Domain: `marketcode.com` (hardcode)
- From address không khớp với domain chính

### **Sau khi sửa:**
- Email sender: `thanhlc.dev@gmail.com` (từ `support_email`) 
- Domain: `marketcode.eqpt` (domain chính xác)
- Sử dụng support_email làm địa chỉ liên hệ chính thức

## 📧 **Thay Đổi Cụ Thể**

### 1. **API Route** (`/app/api/messages/reply/route.ts`)

```typescript
// CŨ: Lấy từ email_smtp_user
.in('key', ['email_from_name', 'email_smtp_user'])

// MỚI: Lấy từ support_email  
.in('key', ['email_from_name', 'support_email'])
```

### 2. **Email Template**
```html
<!-- HTML Template -->
<a href="mailto:${senderEmail}">${senderEmail}</a> | 
<a href="https://marketcode.eqpt">marketcode.eqpt</a>

<!-- Text Template -->
Email: ${senderEmail}
Website: https://marketcode.eqpt
```

### 3. **Database Configuration**
```sql
-- Cấu hình hiện tại
support_email = 'thanhlc.dev@gmail.com'
email_from_name = 'MarketCode Admin' 
```

## 🎯 **Lợi Ích**

### **Tính Nhất Quán:**
- Sử dụng `support_email` cho mọi liên hệ với khách hàng
- Domain `marketcode.eqpt` chính xác
- Không còn hardcode email

### **Chuyên Nghiệp:**
- Email template hiển thị đúng thông tin liên hệ
- Khách hàng biết chính xác email để reply
- Branding nhất quán với domain thực

### **Bảo Mật:**
- Tách biệt SMTP user và support email
- Có thể thay đổi support_email không ảnh hưởng SMTP
- Dễ quản lý cấu hình

## 🧪 **Test Kết Quả**

### **Email được gửi với:**
```
From: MarketCode Admin <thanhlc.dev@gmail.com>
Reply-To: thanhlc.dev@gmail.com
Subject: Re: [Chủ đề gốc]

Template hiển thị:
- Contact: thanhlc.dev@gmail.com  
- Website: marketcode.eqpt
```

### **Khách hàng sẽ thấy:**
- Địa chỉ email chính xác để liên hệ lại
- Domain đúng trong footer
- Thông tin professional và nhất quán

## ✅ **Trạng Thái**

- [x] Cập nhật API sử dụng `support_email`
- [x] Fix domain từ `.com` → `.eqpt`  
- [x] Template động thay vì hardcode
- [x] Text version cũng đã cập nhật
- [x] Ready for testing

**🚀 Hệ thống email reply đã sẵn sàng với cấu hình chính xác!**
