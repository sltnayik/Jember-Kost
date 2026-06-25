"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, LogOut, Users } from "lucide-react";

import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";

const menus = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Verifikasi Kos",
    href: "/admin/kost",
    icon: Building2,
  },
  {
    title: "Pengguna",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-24 h-fit rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-6 px-3">
        <p className="text-lg font-semibold text-[#16A34A]">Admin</p>
        <p className="text-sm text-muted-foreground">JemberKost</p>
      </div>

      <nav className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-muted ${
                active ? "bg-[#16A34A] text-white hover:bg-[#16A34A]" : ""
              }`}
            >
              <Icon className="h-4 w-4" />
              {menu.title}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className="mt-6 border-t pt-4">
        <Button type="submit" variant="ghost" className="w-full justify-start text-red-600">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </form>
    </aside>
  );
}
