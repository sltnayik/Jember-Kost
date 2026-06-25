"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult, EmailInput } from "@/types/auth";
import { emailSchema } from "@/validations/auth";

export async function resendVerificationEmail(
  input: EmailInput
): Promise<AuthActionResult> {
  const parsed = emailSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Email tidak valid.",
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: siteUrl
        ? `${siteUrl}/auth/callback?next=/auth/login`
        : undefined,
    },
  });

  if (error) {
    return {
      error: "Email verifikasi belum dapat dikirim ulang. Coba beberapa saat lagi.",
    };
  }

  return {
    success: "Email verifikasi telah dikirim ulang. Silakan cek inbox atau folder spam.",
  };
}
