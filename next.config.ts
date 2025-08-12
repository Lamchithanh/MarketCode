import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  onRecoverableError: (error: Error, errorInfo: React.ErrorInfo) => {
    if (error.message.includes('hydration')) {
      return; // Bỏ qua lỗi hydration
    }
    console.error(error, errorInfo);
  },
};

export default nextConfig;