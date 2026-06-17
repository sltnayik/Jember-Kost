"use server";

import { createClient } from "@/lib/supabase/server";

export async function googleLogin() {
  const supabase = await createClient();

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "http://localhost:3000/auth/callback",
    },
  });
}