import { create } from 'zustand';
import type { Feedback, StudentRequest } from "../types/user.type";
import { apiFindFeedbackByUserId, apiFindRequestByUserId } from '../apis/user.api';

type UserState = {
  requests: StudentRequest[];
  feedbacks: Feedback[];
  isFetched: boolean;

  fetchAll: (userId: number) => Promise<void>;

  setFeedbacks: (data: Feedback[]) => void;
  setRequests: (data: StudentRequest[]) => void;

  addFeedback: (data: Feedback) => void;
  addRequest: (data: StudentRequest) => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  requests: [],
  feedbacks: [],
  isFetched: false,

  fetchAll: async (userId: number) => {
    if (get().isFetched) return;

    const [requestsRes, feedbacksRes] = await Promise.all([
      apiFindRequestByUserId(userId),
      apiFindFeedbackByUserId(userId)
    ]);

    set({
      requests: requestsRes?.data || [],
      feedbacks: feedbacksRes?.data || [],
      isFetched: true
    });
  },

  setFeedbacks: (data) => set({ feedbacks: data }),
  setRequests: (data) => set({ requests: data }),

  addFeedback: (newFeedback: Feedback) =>
    set((state) => ({
      feedbacks: [newFeedback, ...state.feedbacks]
    })),

  addRequest: (newRequest: StudentRequest) =>
    set((state) => ({
      requests: [newRequest, ...state.requests]
    }))
}));