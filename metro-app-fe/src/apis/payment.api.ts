import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { PaymentMethodRequest,PaymentMethodResponse } from "../types/order.type";

export const apiGetPaymentMethods = async (): Promise<ApiResponse<PaymentMethodResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.PAYMENT}/get-all`);
        return res.data as ApiResponse<PaymentMethodResponse[]>;
    } catch {
        return null;
    }
}

export const apiCreatePaymentMethod = async (
    paymentMethodRequest: PaymentMethodRequest
): Promise<ApiResponse<PaymentMethodResponse> | null> => {
    try {
        const res = await api.post(`${API_PATH.PAYMENT}/create-payment-method`, paymentMethodRequest);
        return res.data as ApiResponse<PaymentMethodResponse>;
    } catch {
        return null;
    }
}

export const apiUpdatePaymentMethod = async (
    paymentMethodId: number,
    paymentMethodRequest: PaymentMethodRequest
): Promise<ApiResponse<PaymentMethodResponse> | null> => {
    try {
        const res = await api.put(`${API_PATH.PAYMENT}/update-payment-method/${paymentMethodId}`, paymentMethodRequest);
        return res.data as ApiResponse<PaymentMethodResponse>;
    } catch {
        return null;
    }
}

export const apiInactivePaymentMethod = async (
    paymentMethodId: number
): Promise<ApiResponse<PaymentMethodResponse> | null> => {
    try {
        const res = await api.delete(`${API_PATH.PAYMENT}/inactive-payment-method/${paymentMethodId}`);
        return res.data as ApiResponse<PaymentMethodResponse>;
    } catch {
        return null;
    }
}

export const apiActivePaymentMethod = async (
    paymentMethodId: number
): Promise<ApiResponse<PaymentMethodResponse> | null> => {
    try {
        const res = await api.put(`${API_PATH.PAYMENT}/active-payment-method/${paymentMethodId}`);
        return res.data as ApiResponse<PaymentMethodResponse>;
    } catch {
        return null;
    }
}
