# Hướng dẫn Tích hợp 2FA và Email Service

## Tổng quan

Hệ thống 2FA và Email Service đã được xây dựng với khả năng cấu hình linh hoạt từ database SystemSetting.

## Cấu trúc Database

### Bảng SystemSetting - Cài đặt hệ thống

```sql
-- Email Service Settings
email_service_enabled: 'true'           -- Bật/tắt service email
email_smtp_host: 'smtp.gmail.com'       -- SMTP host
email_smtp_port: '587'                  -- SMTP port
email_smtp_user: 'thanhlc.dev@gmail.com' -- Gmail user
email_smtp_password: 'ncgq pvim bcve smal' -- App password
email_smtp_secure: 'false'              -- TLS/SSL
email_from_name: 'MarketCode Team'       -- Tên gửi email
email_from_address: 'thanhlc.dev@gmail.com' -- Địa chỉ gửi

-- 2FA System Settings
admin_2fa_enabled: 'false'              -- Bật/tắt 2FA cho admin
user_2fa_enabled: 'true'                -- Bật/tắt 2FA cho user
2fa_issuer_name: 'MarketCode Admin'     -- Tên app trong authenticator
2fa_backup_codes_count: '8'             -- Số lượng backup codes
2fa_token_window: '1'                   -- Độ rộng thời gian token
2fa_qr_code_size: '200'                 -- Kích thước QR code
user_can_disable_2fa: 'true'            -- User có thể tắt 2FA
2fa_setup_email_enabled: 'true'         -- Gửi email khi setup 2FA
login_require_2fa_for_admin: 'false'    -- Bắt buộc 2FA khi login admin
login_require_2fa_for_user: 'false'     -- Bắt buộc 2FA khi login user
```

### Bảng User - Thông tin 2FA

```sql
twoFactorEnabled: boolean               -- 2FA đã được bật
twoFactorSecret: string                 -- TOTP secret key
twoFactorBackupCodes: string[]          -- Backup recovery codes
lastTwoFactorAt: timestamp              -- Lần xác thực 2FA cuối
```

## Services

### EmailService - lib/email-service.ts

```typescript
// Gửi email với template
await EmailService.sendEmail('user@example.com', {
  subject: 'Welcome to MarketCode',
  html: '<h1>Welcome!</h1>'
});

// Test kết nối email
const result = await EmailService.testConnection();
```

### TwoFactorService - lib/two-factor-service.ts

```typescript
// Setup 2FA cho user
const setup = await TwoFactorService.setupTwoFactor(userId);
// setup.qrCodeUrl, setup.secret, setup.backupCodes

// Verify và enable 2FA
await TwoFactorService.enableTwoFactor(userId, secret, token, backupCodes);

// Xác thực 2FA token
const isValid = await TwoFactorService.verifyTwoFactor(userId, token);

// Disable 2FA
await TwoFactorService.disableTwoFactor(userId, password);

// Toggle system 2FA
await TwoFactorService.toggle2FAForSystem(true);
```

## API Routes

### Email API - /api/admin/email/test

```typescript
// GET - Test email connection
// POST - Send test email
```

### 2FA API Routes

```typescript
// /api/admin/two-factor/setup - GET: status, POST: setup
// /api/admin/two-factor/verify - POST: verify và enable
// /api/admin/two-factor/authenticate - POST: xác thực token
// /api/admin/two-factor/disable - POST: tắt 2FA
// /api/admin/two-factor/toggle - GET: status, POST: toggle system
```

### System Settings API - /api/admin/system/settings

```typescript
// GET - Lấy tất cả settings
// POST - Cập nhật setting { key, value }
```

## Components

### TwoFactorManager - components/admin/users/two-factor-manager.tsx

Component quản lý 2FA cho admin, có thể tích hợp vào user management:

```tsx
import { TwoFactorManager } from '@/components/admin/users/two-factor-manager';

function UserManagement() {
  const [selected2FAUser, setSelected2FAUser] = useState(null);

  return (
    <>
      <Button onClick={() => setSelected2FAUser(user)}>
        Setup 2FA
      </Button>
      
      <TwoFactorManager
        user={selected2FAUser}
        open={!!selected2FAUser}
        onOpenChange={(open) => !open && setSelected2FAUser(null)}
        onUpdate={refetchUsers}
      />
    </>
  );
}
```

### TwoFactorAuth - components/auth/two-factor-auth.tsx

Component 2FA cho login flow:

```tsx
import { TwoFactorAuth } from '@/components/auth/two-factor-auth';

function LoginForm() {
  const [need2FA, setNeed2FA] = useState(false);
  
  const handleLogin = async (credentials) => {
    // Check if user has 2FA enabled
    if (userHas2FA) {
      setNeed2FA(true);
      return;
    }
    
    // Normal login
  };

  return (
    <>
      {/* Login form */}
      
      <TwoFactorAuth
        email={credentials.email}
        password={credentials.password}
        open={need2FA}
        onOpenChange={setNeed2FA}
        onSuccess={() => router.push('/dashboard')}
      />
    </>
  );
}
```

## Hooks

### useSystemSettings - hooks/use-system-settings.ts

```typescript
function AdminSettings() {
  const {
    settings,
    loading,
    updateSetting,
    toggle2FAForSystem,
    toggleEmailService
  } = useSystemSettings();

  return (
    <Switch
      checked={settings.admin_2fa_enabled}
      onCheckedChange={toggle2FAForSystem}
    />
  );
}
```

## Cách tích hợp vào User Management

1. **Thêm cột 2FA trong bảng users:**

```tsx
<TableCell>
  <div className="flex items-center gap-2">
    {user.twoFactorEnabled ? (
      <Badge variant="default">
        <ShieldCheck className="w-3 h-3 mr-1" />
        2FA On
      </Badge>
    ) : (
      <Badge variant="secondary">
        <ShieldX className="w-3 h-3 mr-1" />
        2FA Off
      </Badge>
    )}
  </div>
</TableCell>
```

2. **Thêm action 2FA:**

```tsx
<DropdownMenuItem onClick={() => setSelected2FAUser(user)}>
  <Shield className="w-4 h-4 mr-2" />
  Manage 2FA
</DropdownMenuItem>
```

3. **Tích hợp vào auth flow:**

```typescript
// middleware.ts hoặc auth callback
export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });
  
  if (session?.user?.role === 'ADMIN') {
    const require2FA = await TwoFactorService.requiresLoginTwoFactorForAdmin();
    if (require2FA && !session.user.twoFactorVerified) {
      return NextResponse.redirect(new URL('/auth/2fa', request.url));
    }
  }
}
```

## Tính năng nổi bật

1. **Cấu hình linh hoạt từ database**
2. **Hỗ trợ cả admin và user**
3. **QR Code và Manual entry**
4. **Backup codes với download**
5. **Email notifications**
6. **System-wide toggle**
7. **Role-based requirements**
8. **Secure password verification**

## Sử dụng trong thực tế

- Admin có thể bật/tắt 2FA cho toàn hệ thống
- User có thể tự setup/disable 2FA (nếu được phép)
- Backup codes để khôi phục khi mất device
- Email service hỗ trợ template và attachment
- Tất cả settings có thể thay đổi qua admin panel
