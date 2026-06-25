"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AdminKostToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toastValue = searchParams.get("toast");

  useEffect(() => {
    if (toastValue === "verified") {
      toast.success("Kos berhasil diverifikasi.");
      router.replace("/admin/kost");
    }

    if (toastValue === "rejected") {
      toast.success("Kos berhasil ditolak.");
      router.replace("/admin/kost");
    }
  }, [router, toastValue]);

  return null;
}
