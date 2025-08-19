import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { TicketUsageLogResponse } from "../types/ticketusage.type";

export const apiGetTicketUsgaeById = async (id: number): Promise<ApiResponse<TicketUsageLogResponse> | null> => {
    try {
        const res = await api.get(`${API_PATH.TICKETUSAGE}/${id}`);
        return res.data as ApiResponse<TicketUsageLogResponse>;
    } catch {
        return null;
    }
}

export const apiGetTicketByStation = async (stationId: number): Promise<ApiResponse<TicketUsageLogResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.TICKETUSAGE}/station/${stationId}`);
        return res.data as ApiResponse<TicketUsageLogResponse[]>;
    } catch {
        return null;
    }
}