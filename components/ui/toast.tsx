"use client";

import { toast as sonnerToast, type ToastT } from "sonner";

// Toast types with Vietnamese labels
export type ToastType = "success" | "error" | "warning" | "info" | "loading";

// Toast options interface
export interface ToastOptions {
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  };
}

// Default Vietnamese messages
const defaultMessages = {
  success: "Thành công!",
  error: "Có lỗi xảy ra!",
  warning: "Cảnh báo!",
  info: "Thông tin",
  loading: "Đang xử lý...",
};

// Toast service class
class ToastService {
  // Success toast
  success(message: string, options?: ToastOptions) {
    return sonnerToast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || "top-right",
      action: options?.action,
      cancel: options?.cancel,
    });
  }

  // Error toast
  error(message: string, options?: ToastOptions) {
    return sonnerToast.error(message, {
      duration: options?.duration || 6000,
      position: options?.position || "top-right",
      action: options?.action,
      cancel: options?.cancel,
    });
  }

  // Warning toast
  warning(message: string, options?: ToastOptions) {
    return sonnerToast.warning(message, {
      duration: options?.duration || 5000,
      position: options?.position || "top-right",
      action: options?.action,
      cancel: options?.cancel,
    });
  }

  // Info toast
  info(message: string, options?: ToastOptions) {
    return sonnerToast.info(message, {
      duration: options?.duration || 4000,
      position: options?.position || "top-right",
      action: options?.action,
      cancel: options?.cancel,
    });
  }

  // Loading toast
  loading(message: string, options?: ToastOptions) {
    return sonnerToast.loading(message, {
      duration: options?.duration || Infinity,
      position: options?.position || "top-right",
      action: options?.action,
      cancel: options?.cancel,
    });
  }

  // Custom toast
  custom(message: string, options?: ToastOptions & { type?: ToastType }) {
    const type = options?.type || "info";
    const toastMethod = this[type] as (message: string, options?: ToastOptions) => ToastT;
    return toastMethod(message, options);
  }

  // Dismiss toast
  dismiss(toastId?: string | number) {
    return sonnerToast.dismiss(toastId);
  }

  // Dismiss all toasts
  dismissAll() {
    return sonnerToast.dismiss();
  }

  // Promise toast - automatically shows loading, success, or error
  promise<T>(
    promise: Promise<T>,
    {
      loading = "Đang xử lý...",
      success = "Thành công!",
      error = "Có lỗi xảy ra!",
      ...options
    }: {
      loading?: string;
      success?: string;
      error?: string;
    } & ToastOptions = {}
  ) {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      duration: options.duration,
      position: options.position,
      action: options.action,
      cancel: options.cancel,
    });
  }
}

// Create and export toast instance
export const toast = new ToastService();

// Export individual methods for convenience
export const {
  success,
  error,
  warning,
  info,
  loading,
  custom,
  dismiss,
  dismissAll,
  promise,
} = toast;

// Export sonner toast for advanced usage
export { sonnerToast };

// Common toast messages for the application
export const toastMessages = {
  // Auth messages
  auth: {
    loginSuccess: "Đăng nhập thành công!",
    loginError: "Đăng nhập thất bại. Vui lòng kiểm tra thông tin!",
    registerSuccess: "Đăng ký thành công!",
    registerError: "Đăng ký thất bại. Vui lòng thử lại!",
    logoutSuccess: "Đăng xuất thành công!",
    passwordChanged: "Mật khẩu đã được thay đổi!",
    profileUpdated: "Thông tin cá nhân đã được cập nhật!",
  },

  // CRUD messages
  crud: {
    createSuccess: "Tạo mới thành công!",
    createError: "Tạo mới thất bại. Vui lòng thử lại!",
    updateSuccess: "Cập nhật thành công!",
    updateError: "Cập nhật thất bại. Vui lòng thử lại!",
    deleteSuccess: "Xóa thành công!",
    deleteError: "Xóa thất bại. Vui lòng thử lại!",
    fetchError: "Không thể tải dữ liệu. Vui lòng thử lại!",
  },

  // File upload messages
  upload: {
    success: "Tải file lên thành công!",
    error: "Tải file lên thất bại. Vui lòng thử lại!",
    tooLarge: "File quá lớn. Vui lòng chọn file nhỏ hơn!",
    invalidType: "Loại file không được hỗ trợ!",
  },

  // Form messages
  form: {
    validationError: "Vui lòng kiểm tra lại thông tin!",
    submitSuccess: "Gửi form thành công!",
    submitError: "Gửi form thất bại. Vui lòng thử lại!",
  },

  // Network messages
  network: {
    offline: "Không có kết nối internet!",
    timeout: "Yêu cầu quá thời gian chờ!",
    serverError: "Lỗi máy chủ. Vui lòng thử lại sau!",
  },
};

// Hook for using toast in components
export function useToast() {
  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    custom,
    dismiss,
    dismissAll,
    promise,
    messages: toastMessages,
  };
}
