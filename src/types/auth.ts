import { Database } from "./database";

export type UserRole = Database["public"]["Enums"]["user_role"];

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
  user: AuthUser | null;
  loading: boolean;

  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}