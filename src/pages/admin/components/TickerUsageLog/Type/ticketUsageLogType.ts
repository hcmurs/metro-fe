export interface TicketUsageLog {
  ticketUsageLogId: number;
  ticketCode: string;
  usageTime: string;
  stationId: number;
  usageType: 'ENTRY' | 'EXIT';
}
