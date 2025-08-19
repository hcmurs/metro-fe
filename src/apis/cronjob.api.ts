import type { ApiResponse } from "../types/api.type";
import type { HourUsageStatistic, StationUsageStatistic, TicketTypeStatistic } from "../types/cronjob.type";
import api from "./api";

export const apiFindAllTicketTypeStatistics = async (): Promise<ApiResponse<TicketTypeStatistic[]> | null> => {
  try {
    const res = await api.get("/stat/ticket-types");
    return res.data as ApiResponse<TicketTypeStatistic[]>;
  } catch {
    return null;
  }
}

export const apiFindAllStationUsageStatistics = async (): Promise<ApiResponse<StationUsageStatistic[]> | null> => {
  try {
    const res = await api.get("/stat/stations");
    return res.data as ApiResponse<StationUsageStatistic[]>;
  } catch {
    return null;
  }
}

export const apiFindAllHourUsageStatistics = async (): Promise<ApiResponse<HourUsageStatistic[]> | null> => {
  try {
    const res = await api.get("/stat/hours");
    return res.data as ApiResponse<HourUsageStatistic[]>;
  } catch {
    return null;
  }
}