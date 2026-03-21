import { create } from "zustand";

interface SessionState {
  sessionId: number | null;
  runbookId: number | null;
  isConnecting: boolean;
  setSession: (sessionId: number, runbookId: number) => void;
  clearSession: () => void;
  setConnecting: (isConnecting: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  runbookId: null,
  isConnecting: false,

  setSession: (sessionId: number, runbookId: number) => {
    set({ sessionId, runbookId });
  },

  clearSession: () => set({ sessionId: null, runbookId: null }),

  setConnecting: (isConnecting: boolean) => set({ isConnecting }),
}));
