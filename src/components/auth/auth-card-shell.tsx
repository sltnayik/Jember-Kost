import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandMark } from "@/components/shared/brand-mark";

type AuthCardShellProps = {
  title: string;
  description: string;
  icon: ComponentType<LucideProps>;
  children: ReactNode;
};

export function AuthCardShell({ title, description, icon: Icon, children }: AuthCardShellProps) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_50%,#F0FDF4_100%)] px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden rounded-2xl border-border/70 bg-white/95 shadow-xl shadow-slate-950/10">
          <CardHeader className="gap-4 text-center">
            <BrandMark className="mx-auto text-xl font-semibold text-[#0F172A]" />

            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#16A34A]/10 text-[#16A34A] ring-1 ring-[#16A34A]/15">
              <Icon className="size-6" />
            </div>

            <div className="grid gap-2">
              <CardTitle className="text-2xl font-semibold text-[#0F172A]">{title}</CardTitle>
              <CardDescription className="text-balance leading-relaxed">{description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </main>
  );
}
