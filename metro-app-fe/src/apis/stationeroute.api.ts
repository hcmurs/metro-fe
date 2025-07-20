import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import api from "./api";
import type { Station, StationRequest, BusStation, BusStationDetail, StationRouteResponse, StationRouteRequest, Status } from "../types/station.type";

// Get station routes by route ID
export const apiGetStationRoutesByRouteId = async (routeId: number): Promise<ApiResponse<StationRouteResponse[]> | null> => {
  try {
    const response = await api.get(`${API_PATH.STATION_ROUTE}/route/${routeId}`);
    return response.data as ApiResponse<StationRouteResponse[]>;
  } catch {
    return null;
  }
};

// Get station route by ID
export const apiGetStationRouteById = async (id: number): Promise<ApiResponse<StationRouteResponse> | null> => {
  try {
    const response = await api.get(`${API_PATH.STATION_ROUTE}/${id}`);
    return response.data as ApiResponse<StationRouteResponse>;
  } catch {
    return null;
  }
};

// Create new station route
export const apiSaveStationRoute = async (stationRoute: StationRouteRequest): Promise<ApiResponse<StationRouteResponse> | null> => {
  try {
    const response = await api.post(API_PATH.STATION_ROUTE, stationRoute);
    return response.data as ApiResponse<StationRouteResponse>;
  } catch {
    return null;
  }
};

// Update station route
export const apiUpdateStationRoute = async (id: number, stationRoute: StationRouteRequest): Promise<ApiResponse<StationRouteResponse> | null> => {
  try {
    const response = await api.put(`${API_PATH.STATION_ROUTE}/${id}`, stationRoute);
    return response.data as ApiResponse<StationRouteResponse>;
  } catch {
    return null;
  }
};

// Delete station route
export const apiDeleteStationRoute = async (id: number): Promise<ApiResponse<void> | null> => {
  try {
    const response = await api.delete(`${API_PATH.STATION_ROUTE}/${id}`);
    return response.data as ApiResponse<void>;
  } catch {
    return null;
  }
};

// Reorder station routes after deletion
export const apiReorderStationRouteAfterDelete = async (routeId: number): Promise<ApiResponse<void> | null> => {
  try {
    const response = await api.put(`${API_PATH.STATION_ROUTE}/reorder/route/${routeId}`);
    return response.data as ApiResponse<void>;
  } catch {
    return null;
  }
};

// Update station route status
export const apiUpdateStationRouteStatus = async (id: number, status: Status): Promise<ApiResponse<void> | null> => {
  try {
    const response = await api.put(`${API_PATH.STATION_ROUTE}/${id}/status`, null, {
      params: { status }
    });
    return response.data as ApiResponse<void>;
  } catch {
    return null;
  }
};


