"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { rejectKost } from "@/actions/admin/reject-kost";
import { verifyKost } from "@/actions/admin/verify-kost";
import { Button } from "@/components/ui/button";

function SubmitButton({
  children,
  pendingText,
  variant,
}: {
  children: React.ReactNode;
  pendingText: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export function AdminKostActionButtons({ kostId }: { kostId: string }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <form action={verifyKost}>
        <input type="hidden" name="kost_id" value={kostId} />
        <SubmitButton pendingText="Memverifikasi...">Verifikasi</SubmitButton>
      </form>

      <form action={rejectKost}>
        <input type="hidden" name="kost_id" value={kostId} />
        <SubmitButton pendingText="Menolak..." variant="destructive">
          Tolak
        </SubmitButton>
      </form>
    </div>
  );
}
