export interface User {
  id: number;
  full_name: string | null;
  username: string | null;
  email: string;
  user_type?: string;
  image: string | null;
}

export interface SignInRequest {
  email: string;
  password?: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: {
    access: string;
    user: User;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  request_id?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  request_id?: string;
  data: {
    access: string;
    user: User;
  };
}

export interface ResetPasswordRequest {
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  request_id?: string;
}
