import { EditKostForm } from "@/components/owner/edit-kost-form";
import { OwnerShell } from "@/components/owner/owner-shell";
import { getOwnerKostDetail } from "@/services/owner.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditKostPage({ params }: Props) {
  const { id } = await params;
  const kost = await getOwnerKostDetail(id);

  return (
    <OwnerShell title="Edit Kos" description="Perbarui informasi kos, lokasi, harga, rules, WhatsApp, gender, dan jumlah kamar." backButton>
      <EditKostForm kost={kost} />
    </OwnerShell>
  );
}
