"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, PlayCircle, Monitor, Smartphone, Shield } from "lucide-react";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ProductGalleryProps {
  product: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    image?: string;
    images?: string[];
    demoUrl?: string;
  };
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  // Generate gallery images
  const galleryImages = product.images && product.images.length > 0 
    ? product.images.slice(0, 4) 
    : [
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}1`,
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}2`, 
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}3`,
        `https://picsum.photos/800/600?random=${product.id.slice(0, 8)}4`
      ];

  const demoLinks = [
    { label: "Live Demo", url: product.demoUrl || "#", icon: Monitor },
    { label: "Mobile Demo", url: "#", icon: Smartphone },
    { label: "Admin Panel", url: "#", icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Main Preview */}
      <Card className="overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
          <Image
            src={product.thumbnailUrl || product.image || "/Images/images.png"}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          {product.demoUrl && (
            <Button
              variant="secondary"
              size="lg"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={() => product.demoUrl && (window.location.href = product.demoUrl)}
            >
              <PlayCircle className="h-8 w-8 mr-2" />
              Xem Demo
            </Button>
          )}
        </div>
      </Card>

      {/* Demo Links */}
      <div className="grid grid-cols-3 gap-4">
        {demoLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <Button 
              key={index} 
              variant="outline" 
              className="h-auto p-4 flex-col"
              onClick={() => link.url !== "#" && (window.location.href = link.url)}
            >
              <IconComponent className="h-6 w-6 text-amber-600 mb-2" />
              <span className="text-xs text-muted-foreground">
                {link.label}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Screenshots Gallery */}
      <div className="grid grid-cols-2 gap-4">
        {galleryImages.map((imageUrl, i) => (
          <Card 
            key={i} 
            className="aspect-video overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative group"
            onClick={() => setLightboxImage(i)}
          >
            <Image
              src={imageUrl}
              alt={`${product.title} screenshot ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        ))}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox 
        images={galleryImages}
        currentIndex={lightboxImage || 0}
        isOpen={lightboxImage !== null}
        onClose={() => setLightboxImage(null)}
        productTitle={product.title}
      />
    </div>
  );
}
