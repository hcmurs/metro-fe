export interface TicketTypeStatistic {
  id: number;
  ticketType: string;
  usageDate: string;
  usageCount: number;
  createdAt: string;
}

export interface StationUsageStatistic {
  id: number;
  stationId: number;
  stationName: string;
  usageDate: string;
  entryCount: number;
  exitCount: number;
  createdAt: string;
}

export interface HourUsageStatistic {
  id: number;
  usageDate: string;
  startHour: number;
  endHour: number;
  entryCount: number;
  exitCount: number;
  createdAt: string;
}