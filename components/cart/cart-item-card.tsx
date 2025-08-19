"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, Clock } from "lucide-react";
import { CartItem } from "@/hooks/use-cart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove();
      setShowDeleteConfirm(false);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCardClick = () => {
    // Sử dụng id để navigate đến trang chi tiết sản phẩm
    router.push(`/products/${item.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="relative w-full md:w-48 h-48 md:h-auto">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 192px"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>

              {/* Rating & Added Date */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Thêm vào: {formatDate(item.addedAt)}
                  </span>
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {item.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {item.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.technologies.length - 3} khác
                    </Badge>
                  )}
                </div>
              </div>

              {/* Features Preview */}
              {item.features && item.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Tính năng nổi bật:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {item.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end items-center mt-auto pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    setShowDeleteConfirm(true);
                  }}
                  disabled={isRemoving}
                  className="text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {isRemoving ? 'Đang xóa...' : 'Xóa'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa &quot;{item.title}&quot; khỏi giỏ hàng không?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isRemoving ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
