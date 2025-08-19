"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGallery } from "./product-gallery";
import { ProductInfo } from "./product-info";
import { ProductTabs } from "./product-tabs";

interface Review {
  id: string;
  rating: number;
  comment: string;
  isHelpful: boolean;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  downloads: number;
  views: number;
  thumbnailUrl?: string;
  image?: string;
  images?: string[];
  demoUrl?: string;
  category?: { name: string };
  tags?: string[];
  features?: {
    core?: string[];
    technical?: string[];
    ui?: string[];
  } | null;
  updatedAt: string;
  sellerId?: string;
}

export function ProductDetailContainer() {
  const params = useParams();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userHasPurchased, setUserHasPurchased] = useState(false);

  // Fetch product data from database
  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Fetch product data from Supabase using API endpoint
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const result = await response.json();
      
      if (result.success && result.product) {
        const productData = result.product;
        
        // Transform data to match our interface
        const transformedProduct: Product = {
          id: productData.id,
          title: productData.title,
          description: productData.description,
          price: parseFloat(productData.price) || 0,
          originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : undefined,
          rating: 0, // Will be calculated from reviews
          totalRatings: 0, // Will be calculated from reviews
          downloads: productData.downloadCount || 0,
          views: productData.viewCount || 0,
          thumbnailUrl: productData.thumbnailUrl,
          image: productData.thumbnailUrl,
          images: productData.images ? (Array.isArray(productData.images) ? productData.images : []) : [],
          demoUrl: productData.demoUrl,
          category: productData.Category ? { name: productData.Category.name } : undefined,
          tags: [], // Will be fetched from ProductTag relation
          features: productData.features,
          updatedAt: productData.updatedAt,
          sellerId: productData.userId
        };
        
        setProduct(transformedProduct);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews from database
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      
      // Fetch reviews from API
      const response = await fetch(`/api/products/${productId}/reviews`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.reviews) {
          const transformedReviews: Review[] = result.reviews.map((review: {
            id: string;
            rating: number;
            comment?: string;
            isHelpful: number;
            createdAt: string;
            User?: {
              name: string;
              avatar?: string;
            };
          }) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment || "",
            isHelpful: review.isHelpful > 0,
            createdAt: review.createdAt,
            user: review.User ? {
              name: review.User.name,
              avatar: review.User.avatar
            } : undefined
          }));
          
          setReviews(transformedReviews);
          
          // Update product rating based on reviews
          if (transformedReviews.length > 0 && product) {
            const avgRating = transformedReviews.reduce((sum, review) => sum + review.rating, 0) / transformedReviews.length;
            setProduct(prev => prev ? {
              ...prev,
              rating: Number(avgRating.toFixed(1)),
              totalRatings: transformedReviews.length
            } : null);
          }
        }
      }
      
      // TODO: Check if current user has purchased this product
      // This would require authentication and checking OrderItem table
      setUserHasPurchased(false);
      
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch product tags
  const fetchProductTags = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/tags`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.tags) {
          setProduct(prev => prev ? {
            ...prev,
            tags: result.tags.map((tag: { name: string }) => tag.name)
          } : null);
        }
      }
    } catch (error) {
      console.error("Error fetching product tags:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (productId && product) {
      fetchReviews();
      fetchProductTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, product?.id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
            <p className="text-muted-foreground">
              Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Gallery */}
        <ProductGallery product={product} />
        
        {/* Right Column - Info */}
        <ProductInfo product={product} />
      </div>

      {/* Tabs Section */}
      <ProductTabs 
        product={product} 
        reviews={reviewsLoading ? [] : reviews}
        userHasPurchased={userHasPurchased}
      />
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gallery Skeleton */}
        <div className="space-y-6">
          <Skeleton className="aspect-video w-full" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-video" />
            ))}
          </div>
        </div>
        
        {/* Info Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-full mb-3" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center space-y-2">
                    <Skeleton className="h-5 w-5 mx-auto" />
                    <Skeleton className="h-4 w-12 mx-auto" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
