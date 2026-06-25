"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult, LoginInput, UserRole } from "@/types/auth";
import { loginSchema } from "@/validations/auth";
import { redirect } from "next/navigation";

const dashboardByRole: Record<UserRole, string> = {
  admin: "/admin",
  owner: "/owner",
  user: "/user",
};

function isUserRole(role: unknown): role is UserRole {
  return role === "admin" || role === "owner" || role === "user";
}

function getFriendlyLoginError(message: string | undefined) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (
    normalizedMessage.includes("email not confirmed") ||
    normalizedMessage.includes("not confirmed")
  ) {
    return "Email Anda belum diverifikasi. Silakan cek inbox atau folder spam.";
  }

  return "Login gagal. Periksa email dan password Anda.";
}

export async function login(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Email atau password tidak valid.",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error: getFriendlyLoginError(error?.message),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const role = profile?.role as unknown;

  if (profileError || !isUserRole(role)) {
    await supabase.auth.signOut();

    return {
      error: "Profil pengguna tidak ditemukan.",
    };
  }

  await supabase
    .from("profiles")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", data.user.id);

  redirect(dashboardByRole[role]);
}
