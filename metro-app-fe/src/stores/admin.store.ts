import { create } from 'zustand';
import type { TicketType } from '../types/tickettype.type';
import type { FareMatrix } from '../types/fare.type';
import type { Station } from '../types/station.type';
import type { Feedback, StudentRequest, User } from '../types/user.type';

import { apiGetTicketTypes } from '../apis/tickettype.api';
import { apiGetFareMatrices } from '../apis/fare.api';
import { apiGetStations } from '../apis/station.api';
import { apiFindAllFeedbacks, apiFindAllRequests, apiFindUserById } from '../apis/user.api';
import type { HourUsageStatistic, StationUsageStatistic, TicketTypeStatistic } from '../types/cronjob.type';
import { apiFindAllHourUsageStatistics, apiFindAllStationUsageStatistics, apiFindAllTicketTypeStatistics } from '../apis/cronjob.api';

type AdminState = {
  requests: StudentRequest[];
  feedbacks: Feedback[];
  ticketTypes: TicketType[];
  fareMatrices: FareMatrix[];
  stations: Station[];
  users: User[];

  //cronjob statistics
  ticketTypeStatistics: TicketTypeStatistic[];
  stationUsageStatistic: StationUsageStatistic[];
  hourUsageStatistic: HourUsageStatistic[];

  isFetched: boolean;

  fetchAll: () => Promise<void>;

  setTicketTypes: (data: TicketType[]) => void;
  setFareMatrices: (data: FareMatrix[]) => void;
  setStations: (data: Station[]) => void;
  setFeedbacks: (data: Feedback[]) => void;
  setRequests: (data: StudentRequest[]) => void;

  updateTicketType: (data: TicketType) => void;
  updateFareMatrix: (data: FareMatrix) => void;
  updateStation: (data: Station) => void;
  updateFeedback: (data: Feedback) => void;
  updateRequest: (data: StudentRequest) => void;
};

export const useAdminStore = create<AdminState>((set, get) => ({
  requests: [],
  feedbacks: [],
  ticketTypes: [],
  fareMatrices: [],
  stations: [],
  users: [],

  ticketTypeStatistics: [],
  stationUsageStatistic: [],
  hourUsageStatistic: [],

  isFetched: false,

  fetchAll: async () => {
    if (get().isFetched) return;

    const [
      requestsRes,
      feedbacksRes,
      ticketTypesRes,
      fareMatricesRes,
      stationsRes,
      ticketTypeStatsRes,
      stationUsageStatsRes,
      hourUsageStatsRes
    ] = await Promise.all([
      apiFindAllRequests(),
      apiFindAllFeedbacks(),
      apiGetTicketTypes(),
      apiGetFareMatrices(),
      apiGetStations(),
      apiFindAllTicketTypeStatistics(),
      apiFindAllStationUsageStatistics(),
      apiFindAllHourUsageStatistics()
    ]);

    const requests = requestsRes?.data || [];
    const feedbacks = feedbacksRes?.data || [];
    const ticketTypes = ticketTypesRes?.data || [];
    const fareMatrices = fareMatricesRes?.data || [];
    const stations = stationsRes?.data || [];

    const ticketTypeStatistics = ticketTypeStatsRes?.data || [];
    const stationUsageStatistic = stationUsageStatsRes?.data || [];
    const hourUsageStatistic = hourUsageStatsRes?.data || [];

    const allUserIds = [
      ...requests.map(r => r.userId),
      ...feedbacks.map(f => f.userId)
    ];
    const uniqueUserIds = Array.from(new Set(allUserIds));

    const existingUserIds = new Set(get().users.map(u => u.userId));
    const missingUserIds = uniqueUserIds.filter(id => !existingUserIds.has(id));

    const fetchedUsers = await Promise.all(
      missingUserIds.map(id =>
        apiFindUserById(id).then(res => res?.data).catch(() => undefined)
      )
    );

    const validFetchedUsers = fetchedUsers.filter((u): u is User => u !== undefined);

    set({
      requests,
      feedbacks,
      ticketTypes,
      fareMatrices,
      stations,
      users: [...get().users, ...validFetchedUsers],
      ticketTypeStatistics,
      stationUsageStatistic,
      hourUsageStatistic,
      isFetched: true
    });
  },

  setTicketTypes: (data) => set({ ticketTypes: data }),
  setFareMatrices: (data) => set({ fareMatrices: data }),
  setStations: (data) => set({ stations: data }),
  setFeedbacks: (data) => set({ feedbacks: data }),
  setRequests: (data) => set({ requests: data }),

  updateTicketType: (updated: TicketType) =>
    set((state) => ({
      ticketTypes: state.ticketTypes.map((t) =>
        t.id === updated.id ? updated : t
      )
    })),

  updateFareMatrix: (updated: FareMatrix) =>
    set((state) => ({
      fareMatrices: state.fareMatrices.map((f) =>
        f.fareMatrixId === updated.fareMatrixId ? updated : f
      )
    })),

  updateStation: (updated: Station) =>
    set((state) => ({
      stations: state.stations.map((s) =>
        s.stationId === updated.stationId ? updated : s
      )
    })),

  updateFeedback: (updated: Feedback) =>
    set((state) => ({
      feedbacks: state.feedbacks.map((fb) =>
        fb.feedbackId === updated.feedbackId ? updated : fb
      )
    })),

  updateRequest: (updated: StudentRequest) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.requestId === updated.requestId ? updated : r
      )
    }))
}));