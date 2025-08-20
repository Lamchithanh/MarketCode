'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/ui/splash-screen';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Redirect to home page after splash
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <>
      {showSplash && (
        <SplashScreen 
          onComplete={handleSplashComplete}
          duration={3500} // 3.5 seconds
        />
      )}
    </>
  );
}
