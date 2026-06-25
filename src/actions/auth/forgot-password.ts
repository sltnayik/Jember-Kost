"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult, EmailInput } from "@/types/auth";
import { emailSchema } from "@/validations/auth";

export async function forgotPassword(input: EmailInput): Promise<AuthActionResult> {
  const parsed = emailSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Email tidak valid.",
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: siteUrl
      ? `${siteUrl}/auth/callback?next=/auth/reset-password`
      : undefined,
  });

  if (error) {
    return {
      error: "Email reset password belum dapat dikirim. Coba beberapa saat lagi.",
    };
  }

  return {
    success: "Instruksi reset password telah dikirim. Silakan cek inbox atau folder spam.",
  };
}
