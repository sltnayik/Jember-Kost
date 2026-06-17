"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}