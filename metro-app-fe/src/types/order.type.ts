import type { TicketResponse } from "./ticket.type";
import type { FareMatrixResponse } from "./fare.type";
import type { StationResponse } from "./station.type";
import type { TicketTypeResponse } from "./tickettype.type";
export interface OrderTicketDaysRequest{
    ticketId: TicketType,
    paymentMethodId: number
}

export interface OrderTicketSingleRequest{
    fareMatrixId: FareMatrix,
    paymentMethodId: number
}

export interface TicketType{
    id: number
}

export interface FareMatrix{
    id: number
}

export interface PaymentMethodRequest{
    paymentMethodName: string
}

export interface PaymentMethodResponse{
    paymentMethodId: number,
    paymentMethodName: string,
    active: boolean
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

export interface CallBackResponse{
    amount: number,
    transactionStatus: string,
    message: string,
    transactionId: string,
    status: string,
    responseCode: string,
    paymentTime: string
}

export interface OrderPageState {
  orderType: 'single' | 'pass';
  orderRequest: OrderTicketSingleRequest | OrderTicketDaysRequest;
  ticketType?: TicketTypeResponse;
  fareMatrix?: FareMatrixResponse;
  startStation?: StationResponse;
  endStation?: StationResponse;
  quantity?: number;
  amount: number;
  selectedPaymentMethod?: PaymentMethodResponse;
}



export type TransactionStatus = 'PENDING' | 'FAILED' | 'SUCCESSFUL'