"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#f5f2f3' }}>
      {/* Left Side - Image Only */}
      <div className="hidden lg:flex lg:w-1/2 relative justify-center items-center">
      <div className="relative w-150 h-150 rounded-lg">
  <Image
    src="/Images/download.jpg"
    alt="MarketCode"
    fill
    className="object-contain"
    priority
  />
</div>

      </div>

      {/* Right Side - Auth Form (Fixed, No Scroll) */}
      <div className="lg:w-1/2 flex items-center justify-center px-4 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md h-full flex items-center"
        >
          {children}
        </motion.div>
      </div>

      {/* Mobile Background for smaller screens */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <Image
          src="/Images/DL_TD.png"
          alt="MarketCode Background"
          fill
          className="object-cover opacity-10"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
