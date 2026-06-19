"use client";

import Link from "next/link";
import { Home, LayoutDashboard, LogIn, LogOut, Search, UserPlus, UserRound } from "lucide-react";
import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";

const dashboardByRole: Record<UserRole, string> = {
  admin: "/admin",
  owner: "/owner",
  user: "/user",
};

function getDashboardPath(role: UserRole | null | undefined) {
  return role ? dashboardByRole[role] : "/user";
}

export function Navbar() {
  const { isAuthenticated, profile } = useAuth();
  const dashboardPath = getDashboardPath(profile?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold text-[#0F172A]">
          Jember<span className="text-[#16A34A]">Kost</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild className="hidden rounded-xl sm:inline-flex">
                <Link href="/">
                  <Home />
                  Beranda
                </Link>
              </Button>
              <Button variant="ghost" asChild className="hidden rounded-xl sm:inline-flex">
                <Link href="/kost">
                  <Search />
                  Cari Kos
                </Link>
              </Button>
              <Button variant="ghost" asChild className="rounded-xl">
                <Link href="/auth/login">
                  <LogIn />
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D]"
              >
                <Link href="/auth/register">
                  <UserPlus />
                  Register
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-xl">
                <Link href={dashboardPath}>
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" asChild className="hidden rounded-xl sm:inline-flex">
                <Link href="/user/profile">
                  <UserRound />
                  Profil
                </Link>
              </Button>
              <form action={logout}>
                <Button type="submit" variant="outline" className="rounded-xl">
                  <LogOut />
                  Logout
                </Button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
