import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type {  } from "../types/order.type";

export const apiCreateVnPayPayment = async (
  orderInfo: number
): Promise<ApiResponse<Record<string, any>> | null> => {
  try {
    const response = await api.post(`${API_PATH.VNPAY}/create`, null, {
      params: { orderInfo },
    });
    return response.data;
  } catch (error) {
    console.error('VNPAY payment creation failed:', error);
    return null;
  }
};

export const apiVnPayCallback = async (
  query: Record<string, string>
): Promise<ApiResponse<Record<string, any>> | null> => {
  try {
    const response = await api.get(`${API_PATH.VNPAY}/callback`, {
      params: query, // tất cả params VNPAY sẽ truyền trong URL khi redirect
    });

    return response.data;
  } catch (error) {
    console.error('VNPAY callback failed:', error);
    return null;
  }
};