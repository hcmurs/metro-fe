import type { ApiResponse } from "../types/api.type";
import api from "./api";

export const apiSendOtp = async (email: string, purpose: string): Promise<ApiResponse<void> | null> => {
  try {
    const res = await api.post('/notifications/send-otp', { email, purpose });
    return res.data as ApiResponse<void>;
  } catch {
    return null;
  }
}

export const apiVerifyOtp = async (email: string, otp: string, purpose: string): Promise<ApiResponse<void> | null> => {
  try {
    const res = await api.post(`/notifications/verify-otp?email=${email}&otp=${otp}&purpose=${purpose}`);
    return res.data as ApiResponse<void>;
  } catch {
    return null;
  }
}