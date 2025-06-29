import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { StationResponse,StationRequest,BusStation,BusStationDetail } from "../types/station.type";


export const apiGetStations = async (): Promise<ApiResponse<StationResponse[]> | null> => {
  try {
    const res = await api.get(API_PATH.STATIONS);
    return res.data as ApiResponse<StationResponse[]>;
  } catch {
    return null;
  }
};

export const apiGetStationsByRouteId = async (routeId: number): Promise<ApiResponse<StationResponse[]> | null> => {
  try {
    const res = await api.get(`${API_PATH.STATIONS}/route/${routeId}`);
    return res.data as ApiResponse<StationResponse[]>;
  } catch {
    return null;
  }
};

export const apiGetBusStation = async(): Promise<ApiResponse<BusStation[]> | null> => {
  try {
    const res = await api.get(`${API_PATH.BUS}`);
    // Since this API returns raw JSON array instead of wrapped response,
    // we need to wrap it in the expected ApiResponse format
    return res.data as ApiResponse<BusStation[]>;
  } catch {
    return null;
  }
}

export const apiGetBusStationDetail = async(stationId: string): Promise<ApiResponse<BusStationDetail> | null> => {
  try {
    const res = await api.get(`${API_PATH.BUS}/routes/${stationId}`);
    return res.data as ApiResponse<BusStationDetail>;
  } catch {
    return null;
  }
}

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
