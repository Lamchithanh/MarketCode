"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { AlertTriangle, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";

export interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: "default" | "warning" | "danger" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  loadingText?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const modalConfig = {
  default: {
    icon: Info,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    confirmVariant: "default" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    confirmVariant: "outline" as const,
  },
  danger: {
    icon: XCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    confirmVariant: "destructive" as const,
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    confirmVariant: "default" as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    confirmVariant: "default" as const,
  },
};

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  type = "default",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  loading = false,
  loadingText = "Đang xử lý...",
  size = "md",
  showIcon = true,
  className,
}: ConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const config = modalConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    if (loading || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (loading || isProcessing) return;
    onCancel?.();
    onOpenChange(false);
  };

  const sizeClasses = {
    sm: "sm:max-w-[400px]",
    md: "sm:max-w-[500px]",
    lg: "sm:max-w-[600px]",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        <DialogHeader>
          <div className="flex items-start gap-3">
            {showIcon && (
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                config.bgColor,
                config.borderColor,
                "border"
              )}>
                <IconComponent className={cn("w-5 h-5", config.iconColor)} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-foreground">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading || isProcessing}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={loading || isProcessing}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {loading || isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                {loadingText}
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Predefined confirmation modals for common use cases
export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title = "Xác nhận xóa",
  description = "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.",
  itemName,
  onConfirm,
  ...props
}: Omit<ConfirmationModalProps, "type" | "confirmText" | "cancelText"> & {
  itemName?: string;
}) {
  const finalTitle = itemName ? `Xóa "${itemName}"` : title;
  const finalDescription = itemName 
    ? `Bạn có chắc chắn muốn xóa "${itemName}"? Hành động này không thể hoàn tác.`
    : description;

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title={finalTitle}
      description={finalDescription}
      type="danger"
      confirmText="Xóa"
      cancelText="Hủy"
      onConfirm={onConfirm}
      {...props}
    />
  );
}

export function LogoutConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  ...props
}: Omit<ConfirmationModalProps, "title" | "description" | "type" | "confirmText" | "cancelText">) {
  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title="Xác nhận đăng xuất"
      description="Bạn có chắc chắn muốn đăng xuất khỏi admin panel?"
      type="warning"
      confirmText="Đăng xuất"
      cancelText="Ở lại"
      onConfirm={onConfirm}
      {...props}
    />
  );
}

export function UnsavedChangesModal({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  ...props
}: Omit<ConfirmationModalProps, 'title' | 'description' | 'type' | 'confirmText' | 'cancelText'>) {
  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title="Thay đổi chưa lưu"
      description="Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?"
      type="warning"
      confirmText="Rời khỏi"
      cancelText="Ở lại"
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />
  );
}

export function ActionConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  actionText,
  onConfirm,
  type = "default",
  ...props
}: Omit<ConfirmationModalProps, 'confirmText' | 'cancelText'> & {
  actionText: string;
}) {
  return (
    <ConfirmationModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      type={type}
      confirmText={actionText}
      cancelText="Hủy"
      onConfirm={onConfirm}
      {...props}
    />
  );
}

// Hook for easy confirmation modal usage
export function useConfirmationModal() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Partial<ConfirmationModalProps>>({});
  const [resolvePromise, setResolvePromise] = React.useState<((value: boolean) => void) | null>(null);

  const confirm = React.useCallback((options: Partial<ConfirmationModalProps>): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig(options);
      setResolvePromise(() => resolve);
      setOpen(true);
    });
  }, []);

  const handleConfirm = React.useCallback(async () => {
    try {
      await config.onConfirm?.();
      resolvePromise?.(true);
    } catch (error) {
      resolvePromise?.(false);
    }
    setOpen(false);
  }, [config.onConfirm, resolvePromise]);

  const handleCancel = React.useCallback(() => {
    resolvePromise?.(false);
    setOpen(false);
  }, [resolvePromise]);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!newOpen) {
      resolvePromise?.(false);
    }
    setOpen(newOpen);
  }, [resolvePromise]);

  return {
    open,
    confirm,
    modalProps: {
      open,
      onOpenChange: handleOpenChange,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
      ...config,
    },
  };
}
