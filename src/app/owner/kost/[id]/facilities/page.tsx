import { FacilitiesForm } from "@/components/owner/facilities-form";
import { OwnerShell } from "@/components/owner/owner-shell";
import { getOwnerFacilities } from "@/services/owner.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OwnerKostFacilitiesPage({ params }: Props) {
  const { id } = await params;
  const { kost, facilities, selectedFacilityIds } = await getOwnerFacilities(id);

  return (
    <OwnerShell title="Kelola Fasilitas" description={`Pilih fasilitas yang tersedia di ${kost.name}.`}>
      <FacilitiesForm kostId={kost.id} facilities={facilities} selectedFacilityIds={[...selectedFacilityIds]} />
    </OwnerShell>
  );
}
