"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { avatarService } from "@/lib/services/avatar-service";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onAvatarChange?: (avatarUrl: string | null) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({
  currentAvatar,
  userName = "User",
  onAvatarChange,
  disabled = false,
  size = "md",
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const validateFile = (file: File): string | null => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return "File không được vượt quá 5MB";
    }

    // Check file type - expanded to support more formats
    const allowedTypes = [
      "image/jpeg", 
      "image/jpg", 
      "image/png", 
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/bmp",
      "image/tiff"
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Chỉ hỗ trợ các định dạng ảnh: JPG, PNG, WEBP, GIF, SVG, BMP, TIFF";
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    console.log('File selected for upload:', { fileName: file.name, fileSize: file.size, fileType: file.type });
    
    const validationError = validateFile(file);
    if (validationError) {
      console.error('File validation failed:', validationError);
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      console.log('Starting avatar upload service call...');
      // Upload to Supabase via Edge Function
      const { avatarUrl } = await avatarService.uploadAvatar(file);
      console.log('Avatar upload service completed:', { avatarUrl });
      
      // Notify parent component with avatar URL
      onAvatarChange?.(avatarUrl);
      
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Không thể tải ảnh lên");
      setPreview(null);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    try {
      await avatarService.deleteAvatar();
      setPreview(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onAvatarChange?.(null);
      toast.success("Đã xóa ảnh đại diện!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Không thể xóa ảnh đại diện!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar Display */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className={cn(sizeClasses[size], "border-2 border-border")}>
            <AvatarImage 
              src={preview || currentAvatar || undefined} 
              alt={userName}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          
          {/* Upload Button Overlay */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-md"
            onClick={handleClick}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {(preview || currentAvatar) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Xóa
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground">
            Hỗ trợ JPG, PNG, WEBP, GIF, SVG, BMP, TIFF tối đa 5MB
          </p>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div className="text-sm">
              <span className="font-medium">
                {isUploading ? "Đang tải lên..." : "Kéo thả file vào đây"}
              </span>
              {!isUploading && (
                <span className="text-muted-foreground"> hoặc nhấp để chọn</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,image/bmp,image/tiff"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
} 