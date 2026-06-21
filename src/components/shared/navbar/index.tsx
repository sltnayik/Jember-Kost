"use client";

import Link from "next/link";
import { LayoutDashboard, LogIn, LogOut, MapPinned, Menu, Search, Sparkles, UserPlus, UserRound } from "lucide-react";

import { logout } from "@/actions/auth/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
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
  const fallbackName = profile?.full_name ?? "JemberKost";
  const initials = fallbackName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 shadow-sm shadow-black/5 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex shrink-0 items-center gap-2 text-lg font-semibold text-foreground">
          <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <Sparkles className="size-4" />
          </span>
          <span>
            Jember<span className="text-primary">Kost</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Button variant="ghost" asChild className="rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild className="rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground">
            <Link href="/kost">Cari Kos</Link>
          </Button>
          <Button variant="ghost" asChild className="rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground">
            <Link href="/map">Peta</Link>
          </Button>
          <Button variant="ghost" asChild className="rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground">
            <Link href="/about">Tentang</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild className="hidden rounded-2xl text-sm font-medium md:inline-flex">
                <Link href="/auth/login">
                  <LogIn className="size-4" />
                  Login
                </Link>
              </Button>
              <Button asChild className="rounded-2xl bg-primary px-4 text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90">
                <Link href="/auth/register">
                  <UserPlus className="size-4" />
                  Daftar
                </Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 rounded-2xl px-2 md:px-3">
                  <Avatar className="size-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt={fallbackName} />
                    <AvatarFallback className="bg-primary/10 text-primary">{initials || "JK"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate text-sm font-medium md:inline-flex">{fallbackName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-3xl border-border/70 bg-popover p-2 shadow-lg shadow-black/10">
                <DropdownMenuItem asChild className="rounded-2xl">
                  <Link href={dashboardPath}>
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-2xl">
                  <Link href="/user/profile">
                    <UserRound className="size-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-2xl lg:hidden">
                  <Link href="/map">
                    <MapPinned className="size-4" />
                    Peta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-2xl text-destructive focus:text-destructive">
                  <form action={logout} className="w-full">
                    <button type="submit" className="flex w-full items-center gap-2 text-left">
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <Menu className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-3xl border-border/70 bg-popover p-2 shadow-lg shadow-black/10">
                <DropdownMenuItem asChild className="rounded-2xl">
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-2xl">
                  <Link href="/kost">Cari Kos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-2xl">
                  <Link href="/map">Peta</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-2xl">
                  <Link href="/about">Tentang</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!isAuthenticated ? (
                  <DropdownMenuItem asChild className="rounded-2xl">
                    <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild className="rounded-2xl">
                    <Link href={dashboardPath}>Dashboard</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
