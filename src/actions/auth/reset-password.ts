"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult, ResetPasswordInput } from "@/types/auth";
import { resetPasswordSchema } from "@/validations/auth";

export async function resetPassword(
  input: ResetPasswordInput
): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Password baru tidak valid.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      error: "Link reset password tidak valid atau sudah kedaluwarsa.",
    };
  }

  await supabase.auth.signOut();

  return {
    success: "Password berhasil diperbarui. Silakan login dengan password baru.",
  };
}
