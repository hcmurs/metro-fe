import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { FareMatrixRequest, FareMatrix, FindFareRequest } from "../types/fare.type";


export const apiGetFareMatrices = async (): Promise<ApiResponse<FareMatrix[]> | null> => {
    try {
        const res = await api.get(API_PATH.FARE);
        return res.data as ApiResponse<FareMatrix[]>;
    } catch {
        return null;
    }
}

export const apiCreateFareMatrix = async (fareMatrix: FareMatrixRequest): Promise<ApiResponse<FareMatrix> | null> => {
    try {
        const res = await api.post(`${API_PATH.FARE}/create`, fareMatrix);
        return res.data as ApiResponse<FareMatrix>;
    } catch {
        return null;
    }
}

export const apiUpdateFareMatrix = async (fareMatrix: FareMatrixRequest,fareMatrixId: number): Promise<ApiResponse<FareMatrix> | null> => {
    try {
        const res = await api.put(`${API_PATH.FARE}/update/${fareMatrixId}`, fareMatrix);
        return res.data as ApiResponse<FareMatrix>;
    } catch {
        return null;
    }
}

export const apiDeleteFareMatrix = async (fareMatrixId: number): Promise<ApiResponse<FareMatrix> | null> => {
    try {
        const res = await api.delete(`${API_PATH.FARE}/delete/${fareMatrixId}`);
        return res.data as ApiResponse<FareMatrix>;
    } catch {
        return null;
    }
}

export const apiFindFareMatrix = async (fareMatrix: FindFareRequest): Promise<ApiResponse<FareMatrix> | null> => {
    try {
        const res = await api.post(`${API_PATH.FARE}/get-fare`, fareMatrix);
        return res.data as ApiResponse<FareMatrix>;
    } catch {
        return null;
    }
}

export const apiGetFareMatricesByStation = async (stationId: number): Promise<ApiResponse<FareMatrix[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.FARE}/by-station/${stationId}`);
        return res.data as ApiResponse<FareMatrix[]>;
    } catch {
        return null;
    }
}

export const apiGetFareMatrix = async (id: number): Promise<ApiResponse<FareMatrix> | null> => {
    try {
        const res = await api.get(`${API_PATH.FARE}/${id}`);
        return res.data as ApiResponse<FareMatrix>;
    } catch {
        return null;
    }
}
