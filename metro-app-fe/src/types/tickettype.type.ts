export interface TicketTypeRequest {
    ticketTypeId: number,
    name: string,
    description: string,
    price: number,
    isActive: boolean,
    validityDuration: Duration 
}

export interface TicketTypeResponse {
    id: number,
    name: string,
    description: string,
    price: number,
    validityDuration: Duration ,
    isActive: boolean,
    createAt: string,
    updateAt: string,
}

type Duration =
    | 'ONE_DAY'
    | 'THREE_DAYS'
    | 'ONE_WEEK'
    | 'SINGLE'
    | 'ONE_MONTH'
