export interface TicketResponse {
    id: number;
    fareMatrixId: number;
    ticketTypeId: number;
    name: string;
    ticketCode: string;
    actualPrice: number;
    validFrom: string;
    validUntil: string;
    status: TicketStatus;
    createAt: string;
    updateAt: string;
}

export interface TicketScanRequest {
    stationId: number;
    qrCodeData: string;
}

export interface TicketStatusRequest {
    status: TicketStatus;
}

export interface TicketCreateRequest {
    id: number
}

export type TicketStatus = 
    | 'USED'
    | 'EXPIRED'
    | 'NOT_USED'
    | 'PENDING'
    | 'CANCELLED';