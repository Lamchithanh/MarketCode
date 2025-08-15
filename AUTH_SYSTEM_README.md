# MarketCode Authentication System

A clean, modular, and maintainable authentication system built with React hooks, Supabase, and TypeScript.

## 🏗️ Architecture Overview

The authentication system is built using a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                           │
│  (SimplifiedAuthForm, PasswordInput, FormField)           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Custom Hooks                            │
│  (useAuthService, useAuthForm, useAuthMode)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  AuthService                               │
│  (Business logic, Supabase integration)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Supabase                                │
│  (Database, Authentication)                                │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Key Features

- **Clean Code**: Modular architecture with single responsibility principle
- **Type Safety**: Full TypeScript support with proper interfaces
- **Reusable Hooks**: Custom hooks for different authentication concerns
- **Form Management**: React Hook Form integration with Zod validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Password hashing, token management, and secure practices
- **Vietnamese Localization**: Full Vietnamese language support

## 📁 File Structure

```
lib/
├── auth-service.ts          # Core authentication business logic
├── auth-utils.ts            # Authentication utilities and constants
├── supabase.ts              # Supabase client configuration
└── validations/
    └── auth.ts              # Zod validation schemas

hooks/
├── use-auth.ts              # Legacy authentication hook
├── use-auth-service.ts      # New authentication service hook
├── use-auth-form.ts         # Form management hook
├── use-auth-mode.ts         # Mode switching hook
├── use-password-visibility.ts # Password visibility management
└── index.ts                 # Hook exports

components/auth/
├── simplified-auth-form.tsx # Main authentication form
├── password-input.tsx       # Reusable password input
├── form-field.tsx           # Reusable form field
├── auth-form.tsx            # Legacy authentication form
└── index.ts                 # Component exports
```

## 🚀 Usage Examples

### Basic Authentication Form

```tsx
import { SimplifiedAuthForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SimplifiedAuthForm mode="login" />
    </div>
  );
}
```

### Using Authentication Hooks

```tsx
import { useAuthService } from "@/hooks";

export function ProfileComponent() {
  const { authState, updateProfile, changePassword } = useAuthService();

  const handleProfileUpdate = async (updates) => {
    await updateProfile(userId, updates);
  };

  return (
    <div>
      {authState.user && (
        <p>Welcome, {authState.user.name}!</p>
      )}
      {/* Profile form */}
    </div>
  );
}
```

### Custom Form Field

```tsx
import { FormFieldComponent } from "@/components/auth";

export function CustomForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <form>
        <FormFieldComponent
          form={form}
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
      </form>
    </Form>
  );
}
```

## 🔧 Configuration

### Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
JWT_SECRET="your-jwt-secret"
```

### Database Schema

The system expects these tables in your Supabase database:

```sql
-- Users table
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  avatar TEXT,
  isActive BOOLEAN DEFAULT true,
  lastLoginAt TIMESTAMP WITH TIME ZONE,
  emailVerified TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deletedAt TIMESTAMP WITH TIME ZONE
);

-- Verification codes table
CREATE TABLE "VerificationCode" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES "User"(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET')),
  expiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Customization

### Styling

The components use Tailwind CSS classes and can be easily customized:

```tsx
// Custom styling for form fields
<FormFieldComponent
  form={form}
  name="email"
  label="Email"
  className="custom-input-class"
/>
```

### Validation

Customize validation rules in `lib/validations/auth.ts`:

```tsx
export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
```

### Error Messages

Customize error messages in `lib/auth-utils.ts`:

```tsx
export const AUTH_ERRORS = {
  LOGIN: {
    INVALID_CREDENTIALS: "Invalid email or password",
    GENERIC_ERROR: "Login failed. Please try again.",
  },
  // ... more error messages
};
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds of 12
- **Token Management**: Secure token generation and validation
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Protection**: Supabase client handles parameterized queries
- **Session Management**: Secure session handling with NextAuth.js

## 🧪 Testing

The system is designed to be easily testable:

```tsx
// Mock the AuthService for testing
jest.mock("@/lib/auth-service", () => ({
  AuthService: {
    login: jest.fn(),
    register: jest.fn(),
  }
}));

// Test component behavior
test("shows error message on login failure", async () => {
  // Test implementation
});
```

## 📚 API Reference

### AuthService Methods

- `register(data: RegisterFormData): Promise<AuthResult>`
- `login(data: LoginFormData): Promise<AuthResult>`
- `getUserById(userId: string): Promise<AuthResult>`
- `updateProfile(userId: string, updates): Promise<AuthResult>`
- `changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult>`
- `requestPasswordReset(email: string): Promise<AuthResult>`
- `resetPassword(email: string, resetToken: string, newPassword: string): Promise<AuthResult>`
- `verifyEmail(userId: string, verificationCode: string): Promise<AuthResult>`
- `deactivateAccount(userId: string): Promise<AuthResult>`

### Hook Return Values

#### useAuthService
```tsx
{
  authState: {
    user: UserData | null;
    error: string;
    success: string;
    isLoading: boolean;
  };
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  // ... more methods
}
```

#### useAuthForm
```tsx
{
  mode: "login" | "register";
  loginForm: UseFormReturn<LoginFormData>;
  registerForm: UseFormReturn<RegisterFormData>;
  switchMode: (newMode: "login" | "register") => void;
  resetForms: () => void;
}
```

## 🚀 Migration Guide

### From Legacy AuthForm

1. Replace `AuthForm` with `SimplifiedAuthForm`:
```tsx
// Before
import { AuthForm } from "@/components/auth";

// After
import { SimplifiedAuthForm } from "@/components/auth";
```

2. Update form usage:
```tsx
// Before
<AuthForm mode="login" onModeChange={handleModeChange} />

// After
<SimplifiedAuthForm mode="login" onModeChange={handleModeChange} />
```

### From useAuth Hook

1. Replace `useAuth` with `useAuthService`:
```tsx
// Before
import { useAuth } from "@/hooks";

// After
import { useAuthService } from "@/hooks";
```

2. Update hook usage:
```tsx
// Before
const { authState, login, register } = useAuth();

// After
const { authState, login, register } = useAuthService();
```

## 🤝 Contributing

When contributing to the authentication system:

1. **Follow the existing patterns** for consistency
2. **Add proper TypeScript types** for all new functions
3. **Include error handling** for all async operations
4. **Add Vietnamese translations** for new user-facing text
5. **Update this documentation** when adding new features

## 📄 License

This authentication system is part of the MarketCode project and follows the same license terms.
