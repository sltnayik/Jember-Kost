"use server";

import { createClient } from "@/lib/supabase/server";
import type { RegisterInput } from "@/types/auth";
import { registerSchema } from "@/validations/auth";
import { redirect } from "next/navigation";

export type AuthActionResult = {
  error?: string;
};

export async function register(input: RegisterInput): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data register tidak valid.",
    };
  }

  const { full_name, email, password, role } = parsed.data;
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

  if (error) {
    return {
      error: error.message,
    };
  }

  if (data.session) {
    await supabase.auth.signOut();
  }

  redirect("/auth/login");
}
