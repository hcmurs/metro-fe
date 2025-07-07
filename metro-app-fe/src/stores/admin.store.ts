import { create } from 'zustand';
import type { TicketType } from '../types/tickettype.type';
import type { FareMatrix } from '../types/fare.type';
import type { Station } from '../types/station.type';
import type { Feedback, StudentRequest } from '../types/user.type';

import { apiGetTicketTypes } from '../apis/tickettype.api';
import { apiGetFareMatrices } from '../apis/fare.api';
import { apiGetStations } from '../apis/station.api';
import { apiFindAllFeedbacks, apiFindAllRequests } from '../apis/user.api';

type AdminState = {
  requests: StudentRequest[];
  feedbacks: Feedback[];
  ticketTypes: TicketType[];
  fareMatrices: FareMatrix[];
  stations: Station[];
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
  isFetched: false,

  fetchAll: async () => {
    if (get().isFetched) return;

    const [
      requestsRes,
      feedbacksRes,
      ticketTypesRes,
      fareMatricesRes,
      stationsRes
    ] = await Promise.all([
      apiFindAllRequests(),
      apiFindAllFeedbacks(),
      apiGetTicketTypes(),
      apiGetFareMatrices(),
      apiGetStations()
    ]);

    set({
      requests: requestsRes?.data || [],
      feedbacks: feedbacksRes?.data || [],
      ticketTypes: ticketTypesRes?.data || [],
      fareMatrices: fareMatricesRes?.data || [],
      stations: stationsRes?.data || [],
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