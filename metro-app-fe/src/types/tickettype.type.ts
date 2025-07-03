export interface TicketTypeRequest {
    ticketTypeId: number,
    name: string,
    description: string,
    price: number,
    isActive: boolean,
    validityDuration: number 
}

export interface TicketType {
    id: number,
    name: string,
    description: string,
    price: number,
    validityDuration: number,
    isActive: boolean,
    createAt: string,
    updateAt: string,
}
