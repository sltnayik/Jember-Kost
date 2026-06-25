import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { getCurrentProfile } from "@/services/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (profile?.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section className="min-w-0">{children}</section>
    </div>
  );
}
