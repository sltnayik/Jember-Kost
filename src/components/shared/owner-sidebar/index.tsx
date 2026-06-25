"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Star,
  User,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/owner",
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
    title: "Profile",
    href: "/owner/profile",
    icon: User,
  },
];

export default function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-24 h-fit rounded-3xl border bg-card p-5 shadow-sm">
      <div className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-muted
                ${
                  pathname === menu.href
                    ? "bg-green-600 text-white"
                    : ""
                }`}
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