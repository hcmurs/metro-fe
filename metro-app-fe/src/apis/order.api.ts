import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { OrderTicketDaysRequest, OrderTicketSingleRequest,
  OrderResponse ,OrderDetailResponse,TransactionResponse} from "../types/order.type";

export const apiGetOrder = async (
    orderId: number
): Promise<ApiResponse<OrderResponse> | null> => {
    try {
        const res = await api.get(`${API_PATH.ORDER}/${orderId}`);
        return res.data as ApiResponse<OrderResponse>;
    } catch {
        return null;
    }
}

export const apiGetOrderOfUser = async (): Promise<ApiResponse<OrderResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.ORDER}/user`);
        return res.data as ApiResponse<OrderResponse[]>;
    } catch {
        return null;
    }
}

export const apiGetOrderDetailOfUser = async(): Promise<ApiResponse<OrderDetailResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.ORDER}/user/details`);
        return res.data as ApiResponse<OrderDetailResponse[]>;
    } catch {
        return null;
    }
}

export const apiGetOrders = async(): Promise<ApiResponse<OrderResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.ORDER}/all`);
        return res.data as ApiResponse<OrderResponse[]>;
    } catch {
        return null;
    }
}

export const apiCreateOrderSingle = async (
    orderRequest: OrderTicketSingleRequest 
): Promise<ApiResponse<OrderResponse> | null> => {
    try {
        const res = await api.post(`${API_PATH.ORDER}/create/single`, orderRequest);
        return res.data as ApiResponse<OrderResponse>;
    } catch {
        return null;
    }
}

export const apiCreateOrderDays = async (
    orderRequest: OrderTicketDaysRequest 
): Promise<ApiResponse<OrderResponse> | null> => {
    try {
        const res = await api.post(`${API_PATH.ORDER}/create/days`, orderRequest);
        return res.data as ApiResponse<OrderResponse>;
    } catch {
        return null;
    }
}

export const apiUpdateSuccessOrder = async (
    orderId: number
): Promise<ApiResponse<TransactionResponse> | null> => {
    try {
        const res = await api.put(`${API_PATH.ORDER}/update-success/${orderId}`);
        return res.data as ApiResponse<TransactionResponse>;
    } catch {
        return null;
    }
}

export const apiUpdateFailedOrder = async (
    orderId: number
): Promise<ApiResponse<TransactionResponse> | null> => {
    try {
        const res = await api.put(`${API_PATH.ORDER}/update-fail/${orderId}`);
        return res.data as ApiResponse<TransactionResponse>;
    } catch {
        return null;
    }
}

