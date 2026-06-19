import type { User } from "@supabase/supabase-js";
import type { Database, Tables } from "./database";

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

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "admin">;
}

export interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setProfile: (profile: AuthProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}
