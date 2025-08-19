import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { SchedulesResponse, SchedulesRequest } from "../types/schedule.type";

export const apiGetSchedulesByStation = async (stationId: number): Promise<ApiResponse<SchedulesResponse[]> | null> => {
    try {
        const res = await api.get(`${API_PATH.SCHEDULES}/station/${stationId}`);
        return res.data as ApiResponse<SchedulesResponse[]>;
    } catch {
        return null;
    }
}

export const apiCreateSchedule = async (schedule: SchedulesRequest): Promise<ApiResponse<SchedulesResponse> | null> => {
    try {
        const res = await api.post(API_PATH.SCHEDULES, schedule);
        return res.data as ApiResponse<SchedulesResponse>;
    } catch {
        return null;
    }
}

export const apiGetScheduleById = async (scheduleId: number): Promise<ApiResponse<SchedulesResponse> | null> => {
    try {
        const res = await api.get(`${API_PATH.SCHEDULES}/${scheduleId}`);
        return res.data as ApiResponse<SchedulesResponse>;
    } catch {
        return null;
    }
}

export const apiUpdateSchedule = async (schedule: SchedulesRequest, id: number): Promise<ApiResponse<SchedulesResponse> | null> => {
    try {
        const res = await api.put(`${API_PATH.SCHEDULES}/${id}`, schedule);
        return res.data as ApiResponse<SchedulesResponse>;
    } catch {
        return null;
    }
}

export const apiDeleteSchedule = async (id: number): Promise<ApiResponse<SchedulesResponse> | null> => {
    try {
        const res = await api.delete(`${API_PATH.SCHEDULES}/${id}`);
        return res.data as ApiResponse<SchedulesResponse>;
    } catch {
        return null;
    }
}

export const apiGetSchedules = async (): Promise<ApiResponse<SchedulesResponse[]> | null> => {
    try {
        const res = await api.get(API_PATH.SCHEDULES);
        return res.data as ApiResponse<SchedulesResponse[]>;
    } catch {
        return null;
    }
}
