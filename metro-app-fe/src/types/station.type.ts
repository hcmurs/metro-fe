export interface StationRequest {
    routeId: number,
    stationCode: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    sequenceOrder: number
}

export interface StationRouteRequest {
    routeId: number,
    stationId: number,
    sequenceOrder: number,
}

export interface Station {
    stationId: number,
    stationCode: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    status: string,
    createAt: string,
    updateAt: string,
    isDeleted: boolean
}

export interface StationRouteResponse{
    id: number,
    RouteId: number,
    sequenceOrder: number,
    stationsResponse: Station
    status: Status
    isDeleted: boolean,
    createAt: string,
    updateAt: string,
}

export interface BusStation{
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    isActive: number,
    address: string,
    code: string
}

export interface BusStationDetail{
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    isActive: number,
    address: string,
    code: string,
    routes: BusRoute[]
}

export interface BusRoute{
    id: string,
    name: string,
    distance: number,
    duration: number,
    start_time: string,
    end_time: string,
    is_active: number,
    route_num: string,
    direction: string,
    trip_spacing: string
}

export type Status = 'active' | 'decommissioned' | 'maintenance'