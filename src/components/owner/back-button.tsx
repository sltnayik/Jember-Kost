"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => router.back()}>
      <ArrowLeft />
      Kembali
    </Button>
  );
}
