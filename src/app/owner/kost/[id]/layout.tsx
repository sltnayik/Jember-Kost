import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function KostDetailLayout({ children }: Props) {
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
