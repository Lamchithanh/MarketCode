"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, PlayCircle, Monitor, Smartphone } from "lucide-react";
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
  const [imageError, setImageError] = useState(false);

  // Fallback image logic
  const getImageSrc = () => {
    if (imageError) {
      console.log("Image error occurred, using fallback:", "/Images/do.jpg");
      return "/Images/do.jpg"; // Local fallback
    }
    const src = product.thumbnailUrl || product.image || "/Images/do.jpg";
    console.log("Image source:", src);
    return src;
  };

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
    { 
      label: "Live Demo", 
      description: "Xem demo thực tế",
      url: product.demoUrl || "#", 
      icon: Monitor,
      available: !!product.demoUrl 
    },
    { 
      label: "Mobile View", 
      description: "Xem trên mobile",
      url: product.demoUrl ? `${product.demoUrl}?mobile=true` : "#", 
      icon: Smartphone,
      available: !!product.demoUrl 
    },
    { 
      label: "Preview Gallery", 
      description: "Xem ảnh chi tiết",
      url: "#preview", 
      icon: Eye,
      available: true,
      action: () => setLightboxImage(0)
    }
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Main Preview */}
        <Card className="overflow-hidden group">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
            {/* Debug info */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-1 rounded z-10">
              Src: {getImageSrc()}
            </div>
            <Image
              src={getImageSrc()}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 66vw"
              onError={(e) => {
                console.log("Image load error:", e);
                setImageError(true);
              }}
              onLoad={() => console.log("Image loaded successfully")}
              priority
              unoptimized
            />
            {/* Demo Overlay - Always visible on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                {product.demoUrl ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="mb-2"
                    onClick={() => product.demoUrl && window.open(product.demoUrl, '_blank')}
                  >
                    <PlayCircle className="h-6 w-6 mr-2" />
                    Xem Demo Live
                  </Button>
                ) : (
                  <div className="text-white text-lg font-semibold mb-2">
                    <PlayCircle className="h-8 w-8 mx-auto mb-2" />
                    Xem Demo
                  </div>
                )}
                <p className="text-white/80 text-sm">Click để xem demo trực tiếp</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Demo Links */}
        <div className="grid grid-cols-3 gap-4">
          {demoLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button 
                    variant={link.available ? "outline" : "secondary"}
                    className={`h-auto p-4 flex-col transition-all duration-200 ${
                      link.available 
                        ? "hover:bg-primary hover:text-primary-foreground" 
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (link.available) {
                        if (link.action) {
                          link.action();
                        } else if (link.url !== "#") {
                          window.open(link.url, '_blank');
                        }
                      }
                    }}
                    disabled={!link.available}
                  >
                    <IconComponent className={`h-6 w-6 mb-2 ${
                      link.available ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className="text-sm font-medium">
                      {link.label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {link.description}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.available ? link.description : "Chức năng chưa khả dụng"}</p>
                </TooltipContent>
              </Tooltip>
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
    </TooltipProvider>
  );
}
