import { z } from "zod";

// Schema validation cho đổi mật khẩu
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
  newPassword: z.string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
    ),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// Schema validation cho cập nhật thông tin
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50, "Tên không được vượt quá 50 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string()
    .regex(/^[0-9+\-\s\(\)]*$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Giới thiệu không được vượt quá 500 ký tự").optional(),
  avatar: z.string().url("URL avatar không hợp lệ").optional(),
});

// Schema validation cho cài đặt thông báo
export const notificationSettingsSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(false),
  sms: z.boolean().default(false),
  orderUpdates: z.boolean().default(true),
  productUpdates: z.boolean().default(false),
  promotions: z.boolean().default(true),
  marketing: z.boolean().default(false),
  security: z.boolean().default(true),
});

// Schema validation cho upload avatar
export const avatarUploadSchema = z.object({
  file: z.instanceof(File, { message: "Vui lòng chọn file" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File không được vượt quá 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Chỉ hỗ trợ file JPG, PNG, WEBP"
    ),
});

// Type exports
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
export type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;
export type AvatarUploadForm = z.infer<typeof avatarUploadSchema>;

// Default values
export const defaultNotificationSettings: NotificationSettingsForm = {
  email: true,
  push: false,
  sms: false,
  orderUpdates: true,
  productUpdates: false,
  promotions: true,
  marketing: false,
  security: true,
}; 