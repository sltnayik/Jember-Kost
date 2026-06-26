import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { OwnerKostList } from "@/components/owner/owner-kost-list";
import { OwnerShell } from "@/components/owner/owner-shell";
import { Button } from "@/components/ui/button";
import { getOwnerKosts } from "@/services/owner.service";

export default async function OwnerKostPage() {
  const kosts = await getOwnerKosts();

  return (
    <OwnerShell
      title="Manajemen Kos"
      description="Cari, filter, dan kelola seluruh kos milik Anda dari satu tempat."
      action={
        <Button asChild className="h-10 rounded-xl bg-[#16A34A] hover:bg-[#15803D]">
          <Link href="/owner/kost/add">
            <PlusCircle />
            Tambah Kos
          </Link>
        </Button>
      }
    >
      <OwnerKostList kosts={kosts} />
    </OwnerShell>
  );
}
