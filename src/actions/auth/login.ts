"use server";

import { createClient } from "@/lib/supabase/server";
import type { LoginInput, UserRole } from "@/types/auth";
import { loginSchema } from "@/validations/auth";
import { redirect } from "next/navigation";

type LoginActionResult = {
  error?: string;
};

const dashboardByRole: Record<UserRole, string> = {
  admin: "/admin",
  owner: "/owner",
  user: "/user",
};

function isUserRole(role: unknown): role is UserRole {
  return role === "admin" || role === "owner" || role === "user";
}

export async function login(input: LoginInput): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Email atau password tidak valid.",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.user) {
    return {
      error: error?.message ?? "Login gagal. Periksa email dan password.",
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

  redirect(dashboardByRole[role]);
}
