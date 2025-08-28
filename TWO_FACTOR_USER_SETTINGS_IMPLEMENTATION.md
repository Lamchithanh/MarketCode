# Two-Factor Authentication (2FA) User Settings

## Tổng quan
Đã thêm thành công chức năng bật/tắt 2FA cho từng người dùng với:
- Trường `settings` (JSONB) trong bảng User để lưu cài đặt linh hoạt
- Switch component để bật/tắt 2FA
- API endpoints để quản lý user settings
- Tích hợp với hệ thống 2FA hiện có

## Database Changes

### Migration đã thực hiện:
```sql
ALTER TABLE public."User" ADD COLUMN settings JSONB DEFAULT '{"twoFactorEnabled": false}'::jsonb;
```

### Cấu trúc settings JSON:
```json
{
  "twoFactorEnabled": true/false,
  // Có thể thêm các settings khác trong tương lai như:
  // "emailNotifications": true/false,
  // "theme": "light/dark",
  // "language": "vi/en"
}
```

## Components Added

### 1. TwoFactorSwitch Component
**Path:** `components/profile/two-factor-switch.tsx`
- Toggle switch cho 2FA settings
- Tự động load current status từ database
- Hiển thị TwoFactorManager khi enable 2FA
- Update user settings qua API

### 2. User Settings API
**Path:** `app/api/user/settings/route.ts`
- GET: Lấy current settings
- PATCH: Cập nhật settings (merge với existing)
- Authentication required

### 3. Updated Components
- **ProfileSettings**: Thêm TwoFactorSwitch vào security section
- **TwoFactorManager**: Support external control (isOpen, onClose props)

## Usage

### Trong ProfileSettings:
```tsx
<TwoFactorSwitch 
  userId={user.id}
  userRole={user.role}
/>
```

### API Usage:
```typescript
// Get settings
const response = await fetch('/api/user/settings');
const data = await response.json();

// Update settings
await fetch('/api/user/settings', {
  method: 'PATCH',
  body: JSON.stringify({
    settings: { twoFactorEnabled: true }
  })
});
```

## Features

### User Experience:
1. **Enable 2FA**: Click switch → Opens setup modal → Complete setup → Auto enable
2. **Disable 2FA**: Click switch → Immediately disable (no confirmation needed)
3. **Visual Status**: Green check icon when enabled, gray shield when disabled
4. **Loading States**: Spinner during API calls

### Security:
- Settings chỉ được update bởi authenticated user
- Merge với existing settings để không mất dữ liệu
- Error handling với toast notifications

### Extensibility:
- JSON settings field cho phép thêm settings mới dễ dàng
- Component structure dễ mở rộng
- API design support multiple settings trong 1 call

## Next Steps

### Có thể thêm:
1. **Email notifications toggle**
2. **Theme preference**
3. **Language settings**
4. **Privacy settings**
5. **Security notifications**

### Ví dụ mở rộng:
```json
{
  "twoFactorEnabled": true,
  "emailNotifications": {
    "loginAlerts": true,
    "orderUpdates": false,
    "promotions": false
  },
  "privacy": {
    "showProfile": true,
    "showPurchases": false
  },
  "preferences": {
    "theme": "dark",
    "language": "vi"
  }
}
```

## Testing

### Test Cases:
1. Switch từ off → on → Setup 2FA → Success
2. Switch từ on → off → Immediate disable
3. Page reload → Correct switch state
4. Network error → Error handling
5. Concurrent updates → Data integrity

### Database Verification:
```sql
SELECT id, email, settings FROM "User" WHERE settings->>'twoFactorEnabled' = 'true';
```

## Implementation Complete ✅
- [x] Database migration
- [x] User settings API
- [x] TwoFactorSwitch component  
- [x] ProfileSettings integration
- [x] TwoFactorManager updates
- [x] Error handling & UX
- [x] Documentation
