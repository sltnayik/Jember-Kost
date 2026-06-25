"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult, RegisterInput } from "@/types/auth";
import { registerSchema } from "@/validations/auth";
import { redirect } from "next/navigation";

export async function register(input: RegisterInput): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data register tidak valid.",
    };
  }

  const { full_name, email, phone, password, role } = parsed.data;
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: siteUrl ? `${siteUrl}/auth/callback?next=/auth/login` : undefined,
      data: {
        full_name,
        phone,
        role,
      },
    },
  });

  console.log("REGISTER RESULT");
  console.log(data);
  console.log(error);

  if (error) {
    console.error("REGISTER ERROR:", error);

    return {
      error: error.message,
    };
  }

  if (data.session) {
    await supabase.auth.signOut();
  }

  redirect("/auth/register/success");
}
