"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Building2, PlusCircle, Star, User, BarChart3, Menu, X } from "lucide-react";

import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";

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
  const [open, setOpen] = useState(false);

  function renderContent() {
    return (
      <>
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
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-muted
                ${pathname === menu.href || (menu.href === "/owner/dashboard" && pathname === "/owner") ? "bg-green-600 text-white" : ""}`}
              >
                <Icon className="h-5 w-5" />

                <span>{menu.title}</span>
              </Link>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="lg:hidden">
        <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => setOpen(true)} aria-label="Buka menu owner">
          <Menu />
          Menu
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/30" aria-label="Tutup menu owner" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-[min(20rem,85vw)] overflow-y-auto border-r bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-end">
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Tutup menu owner">
                <X />
              </Button>
            </div>
            {renderContent()}
          </aside>
        </div>
      ) : null}

      <aside className="sticky top-24 hidden h-fit rounded-3xl border bg-card p-5 shadow-sm lg:block">
        {renderContent()}
      </aside>
    </>
  );
}
