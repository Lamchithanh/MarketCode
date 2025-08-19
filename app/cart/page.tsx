"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { CartContainer } from "@/components/cart";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <CartContainer />
      </main>
      <Footer />
    </div>
  );
} 