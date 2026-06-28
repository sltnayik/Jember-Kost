"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UserShellProps {
  title: string;
  description?: string;
  backButton?: boolean;
  homeButton?: boolean;
  children: React.ReactNode;
}

export function UserShell({ title, description, backButton = true, homeButton = true, children }: UserShellProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {backButton && (
              <Button variant="ghost" size="sm" asChild className="rounded-xl text-muted-foreground hover:text-foreground">
                <Link href="/user" prefetch={false}>
                  <ChevronLeft className="size-5" />
                </Link>
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
              {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
        </div>
        {homeButton && (
          <Button asChild variant="outline" className="rounded-xl" size="sm">
            <Link href="/user" prefetch={false}>
              <Home className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
        )}
      </div>

      {children}
    </main>
  );
}
