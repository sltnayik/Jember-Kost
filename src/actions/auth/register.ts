"use server";

import { createClient } from "@/lib/supabase/server";

export async function register(
  full_name: string,
  email: string,
  password: string,
  role: "user" | "owner"
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  });

  return {
    data,
    error,
  };
}