import { create } from "zustand";
import type { AuthState } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) =>
    set({
      user,
    }),

  setProfile: (profile) =>
    set({
      profile,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  clear: () =>
    set({
      user: null,
      profile: null,
      loading: false,
    }),
}));
