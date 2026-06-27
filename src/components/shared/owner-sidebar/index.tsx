"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, PlusCircle, Star, User, BarChart3 } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";

const menus = [
  {
    title: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Kos Saya",
    href: "/owner/kost",
    icon: Building2,
  },
  {
    title: "Tambah Kos",
    href: "/owner/kost/add",
    icon: PlusCircle,
  },
  {
    title: "Review",
    href: "/owner/reviews",
    icon: Star,
  },
  {
    title: "Profil",
    href: "/owner/profile",
    icon: User,
  },
  {
    title: "Laporan",
    href: "/owner/report",
    icon: BarChart3,
  },
];

export default function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-24 h-fit rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-4 border-b border-border/70 pb-4">
        <BrandMark className="text-base" imageClassName="rounded-xl" />
      </div>
      <div className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-muted
                ${pathname === menu.href || (menu.href === "/owner/dashboard" && pathname === "/owner") ? "bg-green-600 text-white" : ""}`}
            >
              <Icon className="h-5 w-5" />

              <span>{menu.title}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
