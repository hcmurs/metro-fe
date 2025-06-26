export interface StationRequest {
    routeId: number,
    stationCode: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    sequenceOrder: number
}

export interface StationResponse {
    stationId: number,
    stationCode: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    sequenceOrder: number,
    status: string,
    createAt: string,
    updateAt: string,
    routeId: number,
}

export type Status = 'open' | 'closed'