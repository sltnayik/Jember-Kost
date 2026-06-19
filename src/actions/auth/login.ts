"use server";

import { createClient } from "@/lib/supabase/server";

export async function login(
  email: string,
  password: string
) {
  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  return {
    data,
    error,
  };
}