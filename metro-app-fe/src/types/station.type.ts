export interface StationRequest {
    routeId: number,
    stationCode: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    sequenceOrder: number
}

export interface Station {
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

export type Status = 'open' | 'closed'