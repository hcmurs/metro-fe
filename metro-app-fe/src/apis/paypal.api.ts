import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type {  } from "../types/order.type";

export const apiCreatePaypalPayment = async (
  orderId: number
): Promise<ApiResponse<{ approvalLink: string }> | null> => {
  try {
    const response = await api.post(`${API_PATH.PAYPAL}/create`, null, {
      params: { orderId },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to create PayPal payment:', error);
    return null;
  }
};

export const apiPaypalSuccess = async (
  token: string
): Promise<ApiResponse<{ message: string; token: string }> | null> => {
  try {
    const response = await api.get(`${API_PATH.PAYPAL}/success`, {
      params: { token },
    });

    return response.data;
  } catch (error) {
    console.error('PayPal success handling failed:', error);
    return null;
  }
};

export const apiPaypalCancel = async (
  token: string
): Promise<ApiResponse<{ message: string }> | null> => {
  try {
    const response = await api.get(`${API_PATH.PAYPAL}/cancel`, {
      params: { token },
    });

    return response.data;
  } catch (error) {
    console.error('PayPal cancel handling failed:', error);
    return null;
  }
};

