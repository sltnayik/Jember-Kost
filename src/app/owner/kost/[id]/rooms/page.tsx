import { OwnerShell } from "@/components/owner/owner-shell";
import { RoomsForm } from "@/components/owner/rooms-form";
import { getOwnerKostDetail } from "@/services/owner.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OwnerKostRoomsPage({ params }: Props) {
  const { id } = await params;
  const kost = await getOwnerKostDetail(id);

  return (
    <OwnerShell title="Kelola Kamar" description="Update jumlah kamar dan kamar tersedia. Kamar tersedia tidak boleh melebihi jumlah kamar." backButton>
      <RoomsForm kost={kost} />
    </OwnerShell>
  );
}
