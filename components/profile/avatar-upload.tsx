"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onAvatarChange?: (file: File | null) => void;
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

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "Chỉ hỗ trợ file JPG, PNG, WEBP";
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Notify parent component
    onAvatarChange?.(file);
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

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onAvatarChange?.(null);
  };

  const handleClick = () => {
    if (!disabled) {
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
            disabled={disabled}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={disabled}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải lên
            </Button>
            
            {(preview || currentAvatar) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP tối đa 5MB
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
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Kéo thả file vào đây</span>
              <span className="text-muted-foreground"> hoặc nhấp để chọn</span>
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
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
} 