"use client";

import { useState } from "react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { CartHeader, CartItems, CartSummary, CartEmpty } from "@/components/cart";
import { useRouter } from "next/navigation";

// Mock data cho source code - không có quantity
const mockCartItems = [
  {
    id: "1",
    title: "E-commerce Website Complete",
    price: 499000,
    image: "/products/ecommerce.jpg",
    technologies: ["React", "NextJS", "Prisma", "Stripe", "Tailwind"],
    category: "E-commerce",
    description: "Website bán hàng hoàn chỉnh với React, NextJS, Prisma, Stripe payment integration",
    rating: 4.8,
    features: [
      "Frontend React/NextJS responsive",
      "Admin dashboard quản lý", 
      "Tích hợp thanh toán Stripe",
      "Quản lý sản phẩm, đơn hàng",
      "Authentication & Authorization"
    ]
  },
  {
    id: "2",
    title: "Social Media App",
    price: 799000,
    image: "/products/social.jpg",
    technologies: ["React", "NextJS", "Socket.io", "MongoDB", "Cloudinary"],
    category: "Social Media",
    description: "Ứng dụng mạng xã hội với real-time chat, posts, comments, likes và user profiles",
    rating: 4.9,
    features: [
      "Real-time chat & notifications",
      "Post, comment, like system",
      "User profiles & following",
      "Image/video upload",
      "Responsive design"
    ]
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const router = useRouter();

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // Chuyển đến trang checkout với danh sách items
    router.push('/checkout');
  };

  // Tính toán tổng tiền - không có quantity
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + tax;
  const itemCount = cartItems.length; // Chỉ đếm số lượng items

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <CartHeader itemCount={itemCount} />
            
            {cartItems.length === 0 ? (
              <CartEmpty />
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <CartItems 
                    items={cartItems}
                    onRemoveItem={removeItem}
                  />
                </div>
                <div className="lg:col-span-1">
                  <CartSummary 
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                    itemCount={itemCount}
                    onCheckout={handleCheckout}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 