import type { User } from "@supabase/supabase-js";
import type { z } from "zod";
import type { Database, Tables } from "./database";
import type {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/validations/auth";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type AuthProfile = Tables<"profiles">;

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole | null;
  is_active: boolean;
}

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export type AuthActionResult = {
  error?: string;
  success?: string;
};

export interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setProfile: (profile: AuthProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}
