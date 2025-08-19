export interface TicketUsageLogResponse{
    ticketUsageLogId: number,
    ticketCode: string,
    usageTime: string,
    stationId: number,
    usageType: TicketUsageType,
}

export type TicketUsageType =
    | 'ENTRY'
    | 'EXIT';
