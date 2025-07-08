import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { CallBackResponse, StripeResponse } from "../types/order.type";

export const apiCheckoutStripe = async (
  orderInfo: number
): Promise<ApiResponse<StripeResponse> | null> => {
  try {
    const response = await api.post(`${API_PATH.STRIPE}/checkout`, {
  orderId: orderInfo, // hoặc whatever key server yêu cầu
});
    return response.data;
  } catch (error) {
    console.error('Stripe payment creation failed:', error);
    return null;
  }
};

export const apiStripeCallbackSuccess = async (
    session_id: string
): Promise<ApiResponse<CallBackResponse> | null> => {
  try {
    const response = await api.get(`${API_PATH.STRIPE}/success`, {
        params: {
            session_id
        }
    });

    return response.data;
  } catch (error) {
    console.error('Stripe callback failed:', error);
    return null;
  }
};

export const apiStripeCallbackFailed = async (
      session_id: string
): Promise<ApiResponse<CallBackResponse> | null> => {
  try {
    const response = await api.get(`${API_PATH.STRIPE}/failed`, {
        params: {
            session_id
        }
    });
    return response.data;
  } catch (error) {
    console.error('Stripe callback failed:', error);
    return null;
  }
};