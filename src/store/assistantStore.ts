import { create } from 'zustand';
import type { AssistantMessage } from '@/types';

interface AssistantState {
  messages: AssistantMessage[];
  isLoading: boolean;
  activeTripId: string | null;

  addMessage: (message: AssistantMessage) => void;
  setMessages: (messages: AssistantMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setActiveTripId: (tripId: string | null) => void;
  clearMessages: () => void;
}

export const useAssistantStore = create<AssistantState>()((set) => ({
  messages: [],
  isLoading: false,
  activeTripId: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (messages) => set({ messages }),

  setLoading: (isLoading) => set({ isLoading }),

  setActiveTripId: (activeTripId) => set({ activeTripId }),

  clearMessages: () => set({ messages: [] }),
}));
