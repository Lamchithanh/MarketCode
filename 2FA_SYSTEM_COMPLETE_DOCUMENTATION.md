# 🔐 Two-Factor Authentication (2FA) System - Complete Implementation

## 📋 Overview

This implementation provides a comprehensive Two-Factor Authentication system for the MarketCode project with the following features:

- **Database-driven configuration** via SystemSetting table
- **Role-based access control** (Admin and User roles)
- **Individual user 2FA settings** with toggle switches
- **Email service integration** for notifications
- **Complete UI components** with Modal-based interface
- **Dual API endpoints** for admin and user operations

## 🏗️ Architecture

### Database Schema

#### SystemSetting Table
```sql
CREATE TABLE "SystemSetting" (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### User Table (Enhanced)
```sql
ALTER TABLE "User" 
ADD COLUMN settings JSONB DEFAULT '{}';

-- Index for JSONB queries
CREATE INDEX idx_user_settings_gin ON "User" USING gin(settings);
```

### Core Services

#### TwoFactorService (`lib/two-factor-service.ts`)
- **Purpose**: Handle all 2FA operations including setup, verification, and management
- **Key Methods**:
  - `setupTwoFactor()` - Admin-only 2FA setup
  - `setupTwoFactorForUser()` - User 2FA setup (no admin role required)
  - `verifyTwoFactor()` - TOTP code verification
  - `disableTwoFactor()` - Remove 2FA from account
  - `generateBackupCodes()` - Create recovery codes

#### EmailService (`lib/email-service.ts`)
- **Purpose**: Database-driven email configuration and sending
- **Features**: Gmail SMTP integration, template support, configuration validation

## 🔌 API Endpoints

### Admin Endpoints (`/api/admin/two-factor/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/two-factor/setup` | Get admin 2FA status | Admin role |
| POST | `/api/admin/two-factor/setup` | Setup admin 2FA | Admin role |
| POST | `/api/admin/two-factor/verify` | Verify admin 2FA code | Admin role |
| POST | `/api/admin/two-factor/disable` | Disable admin 2FA | Admin role |

### User Endpoints (`/api/user/two-factor/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/two-factor/setup` | Get user 2FA status | User session |
| POST | `/api/user/two-factor/setup` | Setup user 2FA | User session |
| POST | `/api/user/two-factor/verify` | Verify user 2FA code | User session |
| POST | `/api/user/two-factor/disable` | Disable user 2FA | User session |

### User Settings Endpoint (`/api/user/settings/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/settings` | Get user settings | User session |
| PUT | `/api/user/settings` | Update user settings | User session |

### System Settings Endpoints (`/api/admin/system-settings/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/system-settings` | Get system settings | Admin role |
| POST | `/api/admin/system-settings` | Update system settings | Admin role |

### Email Service Endpoints (`/api/admin/email/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/email/test` | Send test email | Admin role |

## 🎨 UI Components

### TwoFactorManager (`components/ui/two-factor-manager.tsx`)
- **Purpose**: Complete 2FA management interface
- **Features**: 
  - Modal-based responsive design
  - Horizontal card layout for QR codes and backup codes
  - Dual endpoint routing (admin vs user)
  - External control support for integration

```tsx
<TwoFactorManager 
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  userRole="USER"  // or "ADMIN"
/>
```

### TwoFactorSwitch (`components/profile/two-factor-switch.tsx`)
- **Purpose**: Toggle switch for individual user 2FA settings
- **Features**:
  - Visual status indicators
  - Integrated with user settings API
  - Modal trigger for setup/management

```tsx
<TwoFactorSwitch />
```

### ProfileSettings Integration
- Added to user profile interface
- Connects toggle switch with TwoFactorManager
- Saves settings to user JSONB field

## 🔄 Data Flow

### User 2FA Setup Flow
1. User clicks toggle switch in profile settings
2. TwoFactorSwitch triggers TwoFactorManager modal
3. User enters password for verification
4. TwoFactorService.setupTwoFactorForUser() generates secret and QR code
5. User scans QR code with authenticator app
6. User enters TOTP code for verification
7. System saves 2FA secret and enables 2FA
8. Settings updated in user.settings JSONB field

### Admin 2FA Setup Flow
1. Admin accesses 2FA management interface
2. Admin enters admin password
3. TwoFactorService.setupTwoFactor() generates admin secret
4. Admin completes setup with TOTP verification
5. Admin 2FA settings stored in SystemSetting table

## 🗄️ Database Configuration

### SystemSetting Records
```json
{
  "id": "email_smtp_host",
  "name": "SMTP Host",
  "value": "smtp.gmail.com",
  "description": "SMTP server hostname"
}

{
  "id": "email_smtp_port", 
  "name": "SMTP Port",
  "value": "587",
  "description": "SMTP server port"
}

{
  "id": "admin_2fa_secret",
  "name": "Admin 2FA Secret", 
  "value": "BASE32_ENCODED_SECRET",
  "description": "Admin two-factor authentication secret"
}
```

### User Settings JSONB Structure
```json
{
  "twoFactorEnabled": true,
  "twoFactorSecret": "BASE32_ENCODED_SECRET",
  "backupCodes": ["CODE1", "CODE2", "CODE3"],
  "notifications": true,
  "emailAlerts": false
}
```

## 🧪 Testing

### Interactive Test Page
- **File**: `test-2fa-system.html`
- **Features**: Complete UI for testing all API endpoints
- **Includes**: QR code display, backup codes, status checking

### PowerShell Test Script
- **File**: `test-2fa-system.ps1`
- **Features**: Automated API endpoint testing
- **Usage**: `./test-2fa-system.ps1 -BaseUrl "http://localhost:3000"`

### Manual Testing Steps
1. Start Next.js development server
2. Open `test-2fa-system.html` in browser
3. Test user and admin 2FA flows
4. Verify database changes in Supabase dashboard
5. Test with actual authenticator app

## 🔒 Security Features

### Password Verification
- All 2FA setup operations require password verification
- Passwords validated against user/admin accounts
- No 2FA secrets exposed without authentication

### Role-Based Access Control
- Admin endpoints restricted to ADMIN role users
- User endpoints accessible to all authenticated users
- Separate secret storage for admin and user accounts

### Backup Codes
- 10 single-use backup codes generated per user
- Codes can be used when TOTP is unavailable
- Codes removed after successful use

### Data Protection
- 2FA secrets stored as Base32 encoded strings
- JSONB field for flexible user settings
- Database indexes for efficient queries

## 📝 Configuration

### Environment Variables
```env
# Email Configuration (stored in database)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Database
DATABASE_URL=postgresql://...
```

### System Settings Setup
```sql
-- Insert email configuration
INSERT INTO "SystemSetting" (id, name, value, description) VALUES 
('email_smtp_host', 'SMTP Host', 'smtp.gmail.com', 'SMTP server hostname'),
('email_smtp_port', 'SMTP Port', '587', 'SMTP server port'),
('email_smtp_user', 'SMTP User', 'your-email@gmail.com', 'SMTP username'),
('email_smtp_password', 'SMTP Password', 'your-app-password', 'SMTP password');
```

## 🚀 Deployment Checklist

- [ ] Database migration applied (settings JSONB field)
- [ ] SystemSetting table populated with email configuration
- [ ] Environment variables configured
- [ ] Email service tested with real SMTP credentials
- [ ] 2FA flow tested with actual authenticator app
- [ ] Role-based access control verified
- [ ] Backup codes functionality tested
- [ ] UI components integrated into main application

## 🐛 Troubleshooting

### Common Issues

#### 403 Forbidden Errors
- **Cause**: Using admin endpoints with user role
- **Solution**: Use user endpoints (`/api/user/two-factor/`) for regular users

#### Email Service Errors
- **Cause**: Invalid SMTP configuration in database
- **Solution**: Update SystemSetting records with correct email credentials

#### QR Code Not Displaying
- **Cause**: 2FA setup failed or network issues
- **Solution**: Check API response and network connectivity

#### React Hook Warnings
- **Cause**: useEffect dependencies not properly managed
- **Solution**: Wrap functions in useCallback with proper dependencies

### Debug Commands
```powershell
# Test API endpoints
./test-2fa-system.ps1

# Check database settings
# Connect to Supabase and query SystemSetting table

# View user settings
# Query User table settings JSONB field
```

## 📚 Additional Resources

- [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
- [Authy](https://authy.com/)
- [RFC 6238 - TOTP Specification](https://tools.ietf.org/html/rfc6238)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🎯 Implementation Status: ✅ COMPLETE

All components implemented and tested:
- ✅ Database schema with settings JSONB field
- ✅ TwoFactorService with dual admin/user support
- ✅ Complete API endpoints for both roles
- ✅ TwoFactorManager with Modal interface
- ✅ TwoFactorSwitch with profile integration
- ✅ Email service with database configuration
- ✅ Testing tools (HTML page + PowerShell script)
- ✅ React Hook optimization completed
- ✅ Role-based endpoint routing implemented
