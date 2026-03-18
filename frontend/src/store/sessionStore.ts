import { create } from "zustand";

interface SessionState {
  sessionId: number | null;
  isConnecting: boolean;
  setSession: (sessionId: number) => void;
  clearSession: () => void;
  setConnecting: (isConnecting: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  isConnecting: false,

  setSession: (sessionId: number) => set({ sessionId }),

  clearSession: () => set({ sessionId: null }),

  setConnecting: (isConnecting: boolean) => set({ isConnecting }),
}));
