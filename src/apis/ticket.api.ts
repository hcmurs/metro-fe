import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { TicketScanRequest, TicketResponse , TicketStatusRequest, TicketCreateRequest} from "../types/ticket.type";




export const apiGetTicket = async (id: number): Promise<ApiResponse<TicketResponse> | null> => {
    try {
        const res = await api.get(`${API_PATH.TICKET}/${id}`);
        return res.data as ApiResponse<TicketResponse>;
    } catch {
        return null;
    }
}

export const apiGetTicketByType = async (ticketTypeId: number): Promise<ApiResponse<TicketResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.TICKET}/ticket-type/${ticketTypeId}`);
        return res.data as ApiResponse<TicketResponse[]>;
    } catch {
        return null;
    }
}

export const apiGetTicketByFare = async (fareId: number): Promise<ApiResponse<TicketResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.TICKET}/fare-matrix/${fareId}`);
        return res.data as ApiResponse<TicketResponse[]>;
    } catch {
        return null;
    }
}

export const apiGetQrCodeImage = async (
  ticketCode: string
): Promise<ApiResponse<string> | null> => {
  try {
    const response = await api.get(`${API_PATH.TICKET}/generate-qr`, {
      params: { ticketCode },
    });
    return {
      ...response.data,
      data: `data:image/png;base64,${response.data.data}`,
    };
  } catch (error) {
    console.error('Failed to fetch QR code image:', error);
    return null;
  }
};


export const apiGetTicketByCode = async (ticketCode: string): Promise<ApiResponse<TicketResponse> | null> => {
    try {
        const res = await api.get(`${API_PATH.TICKET}/code/${ticketCode}`);
        return res.data as ApiResponse<TicketResponse>;
    } catch {
        return null;
    }
}

export const apiUpdateStatusTicket = async (ticketId: number, status: TicketStatusRequest): Promise<ApiResponse<TicketResponse> | null> => {
    try {
        const res = await api.put(`${API_PATH.TICKET}/${ticketId}/status`, status);
        return res.data as ApiResponse<TicketResponse>;
    } catch {
        return null;
    }
}

export const apiCreateTicketWithFare = async (ticket: TicketCreateRequest): Promise<ApiResponse<TicketResponse> | null> => {
    try {
        const res = await api.post(`${API_PATH.TICKET}/fare-matrix`, ticket);
        return res.data as ApiResponse<TicketResponse>;
    } catch {
        return null;
    }
}

export const apiCreateTicketWithType = async (ticket: TicketCreateRequest): Promise<ApiResponse<TicketResponse> | null> => {
    try {
        const res = await api.post(`${API_PATH.TICKET}/ticket-type`, ticket);
        return res.data as ApiResponse<TicketResponse>;
    } catch {
        return null;
    }
}

export const apiScanEntry = async (ticket: TicketScanRequest): Promise<ApiResponse<TicketResponse> | null> => {
    try {
        const res = await api.post(`${API_PATH.TICKET}/scan/entry`, ticket);
        return res.data as ApiResponse<TicketResponse>;
    } catch {
        return null;
    }
}

export const apiScanExit = async (ticket: TicketScanRequest): Promise<ApiResponse<TicketResponse> | null> => {
    try {
        const res = await api.post(`${API_PATH.TICKET}/scan/exit`, ticket);
        return res.data as ApiResponse<TicketResponse>;
    } catch {
        return null;
    }
}

