# 🖼️ Placeholder Images - Local Solution

## 📋 **Tổng quan**

Thay thế `via.placeholder.com` (không hoạt động) bằng component placeholder local để tránh lỗi DNS và tăng performance.

## 🚀 **Cách sử dụng**

### **1. Import component**
```tsx
import { 
  PlaceholderImage, 
  ProductPlaceholder, 
  AvatarPlaceholder,
  DashboardPlaceholder 
} from "@/components/ui/placeholder-image";
```

### **2. Sử dụng cơ bản**
```tsx
// Custom placeholder
<PlaceholderImage 
  width={400} 
  height={300} 
  text="Custom Text"
  bgColor="#FF6B6B"
  textColor="#FFFFFF"
/>

// Predefined placeholders
<ProductPlaceholder />
<AvatarPlaceholder />
<DashboardPlaceholder />
```

### **3. Với className**
```tsx
<ProductPlaceholder className="rounded-xl shadow-lg" />
```

## 🎨 **Predefined Components**

| Component | Kích thước | Màu nền | Màu chữ | Text |
|-----------|------------|----------|----------|------|
| `ProductPlaceholder` | 300x200 | Green (#10B981) | White | "Product Image" |
| `AvatarPlaceholder` | 40x40 | Gray (#6B7280) | White | "👤" |
| `DashboardPlaceholder` | 300x200 | Purple (#8B5CF6) | White | "Dashboard" |

## 🔧 **Customization**

```tsx
<PlaceholderImage
  width={500}
  height={250}
  text="Hero Banner"
  bgColor="#F59E0B"
  textColor="#1F2937"
  className="rounded-2xl shadow-2xl"
/>
```

## ✅ **Lợi ích**

- 🚀 **Performance**: Không cần HTTP request
- 🔒 **Reliability**: Không phụ thuộc external service
- 🎨 **Customizable**: Dễ dàng thay đổi style
- 📱 **Responsive**: Tự động scale theo kích thước
- 🌐 **Offline**: Hoạt động ngay cả khi mất mạng

## 🚨 **Lưu ý**

- **Không sử dụng** `via.placeholder.com` nữa
- **Ưu tiên** sử dụng `picsum.photos` cho ảnh demo thực tế
- **Sử dụng** placeholder local cho UI mockups
- **Responsive**: Component tự động scale theo container

## 📱 **Responsive Design**

```tsx
// Tự động scale theo container
<div className="w-full max-w-md">
  <ProductPlaceholder className="w-full h-auto" />
</div>
```

---

**Thay thế hoàn tất!** 🎉
