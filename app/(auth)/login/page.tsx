import { EnhancedLoginForm } from "@/components/auth/enhanced-login-form";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <EnhancedLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
