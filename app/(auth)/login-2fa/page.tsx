import { Card } from "@/components/ui/card";
import { EnhancedLoginForm } from "@/components/auth/enhanced-login-form";
import { motion } from "framer-motion";

interface LoginPageProps {
  searchParams: { callbackUrl?: string };
}

const LoginPage = ({ searchParams }: LoginPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <EnhancedLoginForm callbackUrl={searchParams.callbackUrl} />
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
