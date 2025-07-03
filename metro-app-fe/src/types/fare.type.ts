export interface FareMatrix {
    fareMatrixId: number;
    name: string;
    price: number;
    startStationId: number;
    endStationId: number;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
  }

export interface FareMatrixRequest {
    price: number;
    startStationId: number;
    endStationId: number;
    name: string
}

export interface FareMatrixUpdateRequest {
    fareMatrixId: number;
    price: number;
    name: string;
    isActive: boolean;
}

export interface FindFareRequest {
    startStationId: number,
    endStationId: number
}


