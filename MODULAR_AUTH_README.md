# MarketCode Modular Authentication System

A clean, modular authentication system following the **300-line convention** - each component and page stays under 300 lines for easy maintenance and readability.

## 🎯 **Design Principles**

- **Single Responsibility**: Each component has one clear purpose
- **300-Line Rule**: No component exceeds 300 lines of code
- **Composition Over Inheritance**: Build complex UIs from simple components
- **Separation of Concerns**: Logic, UI, and state management are clearly separated
- **Reusability**: Components can be used independently across the application

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                SimplifiedAuthForm (Main)                   │
│                    ~25 lines of code                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼──────┐         ┌─────────▼─────────┐
│ ModeSwitcher │         │   FormContainer   │
│   ~45 lines  │         │    ~65 lines      │
└──────────────┘         └─────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
            ┌───────▼──────┐         ┌─────────▼─────────┐
            │  LoginForm   │         │   RegisterForm    │
            │   ~75 lines  │         │    ~85 lines      │
            └──────────────┘         └───────────────────┘
```

## 📁 **Component Structure**

### **Main Component (~25 lines)**
```tsx
// components/auth/simplified-auth-form.tsx
export function SimplifiedAuthForm({ mode: propMode, onModeChange }: SimplifiedAuthFormProps) {
  const {
    mode,
    isTransitioning,
    authState,
    loginForm,
    registerForm,
    handleModeSwitch,
    onLoginSubmit,
    onRegisterSubmit,
  } = useAuthFormLogic({
    initialMode: propMode,
    onModeChange,
  });

  return (
    <div className="relative w-full max-w-md">
      <ModeSwitcher
        mode={mode}
        onModeSwitch={handleModeSwitch}
        isTransitioning={isTransitioning}
      />
      
      <FormContainer
        mode={mode}
        loginForm={loginForm}
        registerForm={registerForm}
        onLoginSubmit={onLoginSubmit}
        onRegisterSubmit={onRegisterSubmit}
        isLoading={authState.isLoading}
        error={authState.error}
        success={authState.success}
      />
    </div>
  );
}
```

### **Mode Switcher (~45 lines)**
```tsx
// components/auth/mode-switcher.tsx
export function ModeSwitcher({ mode, onModeSwitch, isTransitioning }: ModeSwitcherProps) {
  return (
    <div className="flex mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm">
      {/* Login/Register toggle buttons with animations */}
    </div>
  );
}
```

### **Form Container (~65 lines)**
```tsx
// components/auth/form-container.tsx
export function FormContainer({ mode, loginForm, registerForm, ... }: FormContainerProps) {
  const formVariants = { /* animation variants */ };

  return (
    <Card className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <AnimatePresence mode="wait">
        <motion.div key={mode} variants={formVariants}>
          {mode === "login" ? <LoginForm {...loginProps} /> : <RegisterForm {...registerProps} />}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
```

### **Form Components (~75-85 lines each)**
```tsx
// components/auth/login-form.tsx
export function LoginForm({ form, onSubmit, isLoading, error, success }: LoginFormProps) {
  return (
    <>
      <CardHeader>...</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <StatusMessage error={error} success={success} />
            <FormFieldComponent name="email" ... />
            <PasswordInput name="password" ... />
            <Button type="submit">...</Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
```

## 🔧 **Custom Hooks Structure**

### **Main Logic Hook (~50 lines)**
```tsx
// hooks/use-auth-form-logic.ts
export function useAuthFormLogic({ initialMode, onModeChange }: UseAuthFormLogicProps) {
  const { authState, login, register, clearMessages } = useAuthService();
  const { mode, loginForm, registerForm, switchMode, resetForms } = useAuthForm({...});
  const { isTransitioning } = useAuthMode(mode);

  // Effects and handlers
  useEffect(() => { /* clear messages on mode change */ }, [mode, clearMessages]);
  useEffect(() => { /* auto-switch after registration */ }, [authState.success, mode, switchMode, clearMessages]);

  const handleModeSwitch = (newMode: "login" | "register") => { /* mode switching logic */ };
  const onLoginSubmit = async (data: LoginFormData) => { await login(data); };
  const onRegisterSubmit = async (data: RegisterFormData) => { await register(data); };

  return { mode, isTransitioning, authState, loginForm, registerForm, handleModeSwitch, onLoginSubmit, onRegisterSubmit };
}
```

### **Specialized Hooks**
- **`useAuthService`**: Core authentication operations (~120 lines)
- **`useAuthForm`**: Form state management (~60 lines)
- **`useAuthMode`**: Mode switching with transitions (~30 lines)
- **`usePasswordVisibility`**: Password field visibility (~25 lines)

## 🎨 **Component Composition Benefits**

### **1. Easy to Test**
```tsx
// Test individual components in isolation
test("ModeSwitcher switches between modes", () => {
  render(<ModeSwitcher mode="login" onModeSwitch={mockSwitch} isTransitioning={false} />);
  // Test specific behavior
});

test("LoginForm handles submission", () => {
  render(<LoginForm form={mockForm} onSubmit={mockSubmit} isLoading={false} />);
  // Test form behavior
});
```

### **2. Easy to Maintain**
```tsx
// Update mode switching logic without touching forms
export function ModeSwitcher({ mode, onModeSwitch, isTransitioning }: ModeSwitcherProps) {
  // Only this component needs to change for mode switching updates
}
```

### **3. Easy to Reuse**
```tsx
// Use components independently
import { StatusMessage } from "@/components/auth";

export function ProfileForm() {
  return (
    <form>
      <StatusMessage error={profileError} success={profileSuccess} />
      {/* Other form fields */}
    </form>
  );
}
```

### **4. Easy to Extend**
```tsx
// Add new authentication methods easily
export function OAuthButtons() {
  return (
    <div className="space-y-2">
      <Button onClick={() => signIn("google")}>Google</Button>
      <Button onClick={() => signIn("github")}>GitHub</Button>
    </div>
  );
}

// Then in FormContainer:
{showOAuth && <OAuthButtons />}
```

## 📊 **Line Count Analysis**

| Component | Lines | Responsibility | Complexity |
|-----------|-------|----------------|------------|
| `SimplifiedAuthForm` | ~25 | Main orchestrator | Low |
| `ModeSwitcher` | ~45 | Mode switching UI | Low |
| `FormContainer` | ~65 | Form container + animations | Medium |
| `LoginForm` | ~75 | Login form UI | Low |
| `RegisterForm` | ~85 | Registration form UI | Low |
| `StatusMessage` | ~20 | Status display | Very Low |
| `PasswordInput` | ~45 | Password field | Low |
| `FormFieldComponent` | ~35 | Generic form field | Very Low |

## 🚀 **Usage Examples**

### **Basic Usage (Same as before)**
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

### **Advanced Usage (Component composition)**
```tsx
import { ModeSwitcher, FormContainer, LoginForm } from "@/components/auth";

export default function CustomAuthPage() {
  // Custom logic here
  
  return (
    <div>
      <ModeSwitcher mode={mode} onModeSwitch={handleSwitch} isTransitioning={false} />
      <FormContainer mode={mode} {...formProps} />
    </div>
  );
}
```

### **Reusing Individual Components**
```tsx
import { StatusMessage, FormFieldComponent } from "@/components/auth";

export function ContactForm() {
  return (
    <form>
      <StatusMessage error={contactError} success={contactSuccess} />
      <FormFieldComponent form={form} name="name" label="Name" />
      <FormFieldComponent form={form} name="email" label="Email" type="email" />
    </form>
  );
}
```

## 🔒 **Security & Best Practices**

- **Input Validation**: Each form component validates its own inputs
- **Error Handling**: Centralized error handling through StatusMessage
- **Type Safety**: Full TypeScript support with proper interfaces
- **Accessibility**: Each component handles its own accessibility concerns
- **Performance**: Optimized with React.memo and useCallback where appropriate

## 🧪 **Testing Strategy**

### **Unit Tests**
```tsx
// Test each component in isolation
describe("ModeSwitcher", () => {
  it("calls onModeSwitch when login button is clicked", () => {
    const mockSwitch = jest.fn();
    render(<ModeSwitcher mode="register" onModeSwitch={mockSwitch} isTransitioning={false} />);
    
    fireEvent.click(screen.getByText("Đăng nhập"));
    expect(mockSwitch).toHaveBeenCalledWith("login");
  });
});
```

### **Integration Tests**
```tsx
// Test component interactions
describe("SimplifiedAuthForm", () => {
  it("switches between login and register modes", async () => {
    render(<SimplifiedAuthForm />);
    
    // Test mode switching
    fireEvent.click(screen.getByText("Đăng ký"));
    expect(screen.getByText("Tạo tài khoản mới")).toBeInTheDocument();
  });
});
```

## 📈 **Performance Benefits**

- **Smaller Bundle**: Tree-shaking works better with smaller components
- **Faster Rendering**: React can optimize smaller component trees
- **Better Caching**: Smaller components are easier to cache
- **Reduced Re-renders**: Targeted updates to specific components

## 🔄 **Migration Path**

### **From Monolithic to Modular**
1. **Phase 1**: Extract ModeSwitcher (minimal changes)
2. **Phase 2**: Extract StatusMessage and form components
3. **Phase 3**: Extract FormContainer and logic hook
4. **Phase 4**: Clean up main component

### **Backward Compatibility**
```tsx
// Old usage still works
<SimplifiedAuthForm mode="login" />

// New usage available
<ModeSwitcher mode="login" onModeSwitch={handleSwitch} />
```

## 🤝 **Contributing Guidelines**

When adding new features:

1. **Keep components under 300 lines**
2. **Extract reusable logic into hooks**
3. **Use composition over inheritance**
4. **Maintain single responsibility principle**
5. **Add proper TypeScript types**
6. **Include Vietnamese translations**
7. **Update this documentation**

## 📚 **API Reference**

### **Component Props**
```tsx
interface SimplifiedAuthFormProps {
  mode?: "login" | "register";
  onModeChange?: (mode: "login" | "register") => void;
}

interface ModeSwitcherProps {
  mode: "login" | "register";
  onModeSwitch: (newMode: "login" | "register") => void;
  isTransitioning: boolean;
}

interface FormContainerProps {
  mode: "login" | "register";
  loginForm: UseFormReturn<LoginFormData>;
  registerForm: UseFormReturn<RegisterFormData>;
  onLoginSubmit: (data: LoginFormData) => Promise<void>;
  onRegisterSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
  success?: string;
}
```

### **Hook Return Values**
```tsx
// useAuthFormLogic
{
  mode: "login" | "register";
  isTransitioning: boolean;
  authState: AuthState;
  loginForm: UseFormReturn<LoginFormData>;
  registerForm: UseFormReturn<RegisterFormData>;
  handleModeSwitch: (newMode: "login" | "register") => void;
  onLoginSubmit: (data: LoginFormData) => Promise<void>;
  onRegisterSubmit: (data: RegisterFormData) => Promise<void>;
}
```

This modular architecture ensures your authentication system is maintainable, testable, and follows modern React best practices while staying under the 300-line convention.
