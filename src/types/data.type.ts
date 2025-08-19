export interface AnalyticsReport {
  analyticsId: number;
  reportDate: string; 
  totalTicketsSold: number;
  totalRevenue: number; 
  totalPassengers: number;
  peakHourTickets: number;
  offPeakTickets: number;
  singleJourneyCount: number;
  passTicketsCount: number;
  oneDayTicketsCount: number;
  threeDayTicketsCount: number;
  weekTicketsCount: number;
  monthTicketsCount: number;
  studentTicketsCount: number;
  avgJourneyDistance: number; 
  createAt: string; 
  updateAt: string;
}
