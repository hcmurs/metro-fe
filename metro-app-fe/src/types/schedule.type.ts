export type Direction =
    'forward' | 'backward'

export interface SchedulesRequest {
    stationId: number;
    timeArrival: string;     // định dạng "HH:mm"
    timeDeparture: string;   // định dạng "HH:mm"
    description: string;
    direction: Direction
}
export interface SchedulesResponse {
    scheduleId: number;
    description: string;
    timeArrival: string;     // "HH:mm"
    timeDeparture: string;   // "HH:mm"
    direction: Direction;
    createdAt: string;
    updatedAt: string;
    stationId: number;
    stationName: string;
}