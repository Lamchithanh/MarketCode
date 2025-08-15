// Authentication constants
export const AUTH_CONSTANTS = {
  AUTO_SWITCH_DELAY: 2000, // 2 seconds
  TRANSITION_DELAY: 150, // 150ms
  MIN_PASSWORD_LENGTH: 6,
} as const;

// Form field names
export const AUTH_FIELDS = {
  LOGIN: {
    EMAIL: "email",
    PASSWORD: "password",
  },
  REGISTER: {
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    EMAIL: "email",
    PASSWORD: "password",
    CONFIRM_PASSWORD: "confirmPassword",
  },
} as const;

// Error messages
export const AUTH_ERRORS = {
  LOGIN: {
    INVALID_CREDENTIALS: "Email hoặc mật khẩu không chính xác",
    GENERIC_ERROR: "Đã xảy ra lỗi khi đăng nhập",
  },
  REGISTER: {
    GENERIC_ERROR: "Đã xảy ra lỗi khi đăng ký",
  },
} as const;

// Success messages
export const AUTH_SUCCESS = {
  LOGIN: "Đăng nhập thành công!",
  REGISTER: "Tài khoản đã được tạo thành công!",
} as const;

// Helper function to get field error
export function getFieldError(fieldName: string, errors: Record<string, any>): string | undefined {
  return errors[fieldName]?.message;
}

// Helper function to check if form is valid
export function isFormValid(errors: Record<string, any>): boolean {
  return Object.keys(errors).length === 0;
}

// Helper function to format user name
export function formatUserName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

// Helper function to validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < AUTH_CONSTANTS.MIN_PASSWORD_LENGTH) {
    errors.push(`Mật khẩu phải có ít nhất ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} ký tự`);
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất 1 chữ thường");
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất 1 chữ hoa");
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Mật khẩu phải chứa ít nhất 1 số");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
