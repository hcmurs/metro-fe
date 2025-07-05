export interface FareMatrix {
    fareMatrixId: number;
    name: string;
    price: number;
    startStationId: number;
    endStationId: number;
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
}

export interface FindFareRequest {
    startStationId: number;
    endStationId: number;
}


