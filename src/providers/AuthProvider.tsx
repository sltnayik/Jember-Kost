"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import type { AuthProfile } from "@/types/auth";

type AuthProviderProps = {
  children: ReactNode;
  initialUser: User | null;
  initialProfile: AuthProfile | null;
};

export default function AuthProvider({
  children,
  initialUser,
  initialProfile,
}: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clear = useAuthStore((state) => state.clear);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        clear();
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setUser(user);
      setProfile(profile);
      setLoading(false);
    }

    setUser(initialUser);
    setProfile(initialProfile);
    setLoading(false);
    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clear, initialProfile, initialUser, setLoading, setProfile, setUser]);

  return <>{children}</>;
}
