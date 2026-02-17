import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase"; // adjust path

interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;

  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAuthenticated: false,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
    }),

  logout: async () => {
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
