import { OwnerShell } from "@/components/owner/owner-shell";
import { PhotosManager } from "@/components/owner/photos-manager";
import { getOwnerKostDetail } from "@/services/owner.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OwnerKostPhotosPage({ params }: Props) {
  const { id } = await params;
  const kost = await getOwnerKostDetail(id);

  return (
    <OwnerShell title="Kelola Foto" description="Tambah foto, preview, hapus foto, dan ubah thumbnail kos." backButton>
      <PhotosManager kost={kost} />
    </OwnerShell>
  );
}
