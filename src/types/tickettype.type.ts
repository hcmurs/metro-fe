export interface TicketTypeRequest {
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
    forStudent: boolean,
    createdAt: string,
    updatedAt: string,
}
