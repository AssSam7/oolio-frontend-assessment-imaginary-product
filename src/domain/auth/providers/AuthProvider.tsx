import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "../store/auth.store";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    // 1️⃣ Load initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // 2️⃣ Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setSession]);

  return <>{children}</>;
};
