import type { TicketResponse } from "./ticket.type";

export interface OrderTicketDaysRequest{
    ticketId: number,
    paymentMethodId: number
}

export interface OrderTicketSingleRequest{
    fareMatrixId: number,
    paymentMethodId: number
}

export interface PaymentMethodRequest{
    paymentMethodName: string
}

export interface PaymentMethodResponse{
    paymentMethodName: string,
    isActive: boolean
}

export interface TransactionResponse{
    transactionId: number,
    userId: number,
    paymentMethodId: number,
    paymentMethodName: string,
    transactionStatus: TransactionStatus,
    amount: number,
    createAt: string
}

export interface OrderResponse{
    orderId: number,
    userId: number,
    ticketId: number,
    status: TransactionStatus
    amount: number,
    createAt: string,
    transaction: TransactionResponse
}

export interface OrderDetailResponse{
    orderId: number,
    userId: number,
    status: TransactionStatus,
    amount: number,
    ticket: TicketResponse
}

export type TransactionStatus = 'PENDING' | 'FAILED' | 'SUCCESSFUL'