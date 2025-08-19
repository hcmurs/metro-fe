import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { TicketType, TicketTypeRequest } from "../types/tickettype.type";

export const apiGetTicketTypes = async (): Promise<ApiResponse<TicketType[]> | null> => {
	try {
		const res = await api.get(API_PATH.TICKETTYPE);
		return res.data as ApiResponse<TicketType[]>;
	} catch {
		return null;
	}
}

export const apiGetTicketTypeById = async (ticketTypeId: number): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await api.get(`${API_PATH.TICKETTYPE}/${ticketTypeId}`);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}

export const apiUpdateTicketType = async (ticketType: TicketTypeRequest, id: number): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await api.put(`${API_PATH.TICKETTYPE}/update/${id}`, ticketType);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}

export const apiDeleteTicketType = async (id: number): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await api.delete(`${API_PATH.TICKETTYPE}/delete/${id}`);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}

export const apiCreateTicketType = async (ticketType: TicketTypeRequest): Promise<ApiResponse<TicketType> | null> => {
	try {
		const res = await api.post(`${API_PATH.TICKETTYPE}/create`, ticketType);
		return res.data as ApiResponse<TicketType>;
	} catch {
		return null;
	}
}
