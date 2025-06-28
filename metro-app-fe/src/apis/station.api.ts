import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { StationResponse,StationRequest } from "../types/station.type";

export const apiGetStations = async (): Promise<ApiResponse<StationResponse[]> | null> => {
  try {
    const res = await api.get(API_PATH.STATIONS);
    return res.data as ApiResponse<StationResponse[]>;
  } catch {
    return null;
  }
};

export const apiCreateStation = async (station: StationRequest): Promise<ApiResponse<StationResponse> | null> => {
  try {
    const res = await api.post(API_PATH.STATIONS, station);
    return res.data as ApiResponse<StationResponse>;
  } catch {
    return null;
  }
}

export const apiGetStationById = async (stationId: number): Promise<ApiResponse<StationResponse> | null> => {
    try {
      const res = await api.get(`${API_PATH.STATIONS}/${stationId}`);
      return res.data as ApiResponse<StationResponse>;
    } catch {
      return null;
    }
  }

  export const apiGetStationByName = async (stationName: string): Promise<ApiResponse<StationResponse[]> | null> => {
    try {
      const res = await api.get(`${API_PATH.STATIONS}/search?name=${stationName}`);
      return res.data as ApiResponse<StationResponse[]>;
    } catch {
      return null;
    }
  }

  export const apiUpdateStation = async (station: StationResponse, id: number): Promise<ApiResponse<StationResponse> | null> => {
    try {
      const res = await api.put(`${API_PATH.STATIONS}/${id}`, station);
      return res.data as ApiResponse<StationResponse>;
    } catch {
      return null;
    }
  }

  export const apiDeleteStation = async (id: number): Promise<ApiResponse<StationResponse> | null> => {
    try {
      const res = await api.delete(`${API_PATH.STATIONS}/${id}`);
      return res.data as ApiResponse<StationResponse>;
    } catch {
      return null;
    }
  }
