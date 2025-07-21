export interface FareMatrix {
  fareMatrixId: number;
  name: string;
  price: number;
  startStationId: number;
  endStationId: number;
  distanceInKm: number
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FareMatrixRequest {
  price: number;
  startStationId: number;
  endStationId: number;
  isActive: boolean;
  name: string;
  distanceInKm?: number
}

export interface FindFareRequest {
  startStationId: number;
  endStationId: number;
}


export interface FarePricing {
  id: number;
  minDistanceKm: number;
  maxDistanceKm: number;
  price: number;
  isActive: boolean;
}

export interface FarePricingRequest {
  minDistanceKm: number;
  maxDistanceKm: number;
  price: number;
  isActive: boolean;
}