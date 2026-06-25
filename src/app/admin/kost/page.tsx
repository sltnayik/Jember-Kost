import { rejectKost } from "@/actions/admin/reject-kost";
import { verifyKost } from "@/actions/admin/verify-kost";
import { AdminKostToast } from "@/components/admin/admin-kost-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils/format-rupiah";

type AdminKostStatus = "pending" | "available" | "full" | "rejected" | null;
const pendingStatus = "pending";

type AdminKost = {
  id: string;
  name: string;
  status: AdminKostStatus;
  price: number;
  created_at: string | null;
  campuses:
    | {
        name: string;
      }[]
    | null;
  profiles:
    | {
        full_name: string;
      }[]
    | null;
};

function getFirstRelation<T>(relation: T[] | T | null | undefined) {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation ?? null;
}

type AdminKostRelation = {
  campuses:
    | {
        name: string;
      }[]
    | {
        name: string;
      }
    | null;
  profiles:
    | {
        full_name: string;
      }[]
    | {
        full_name: string;
      }
    | null;
};

type AdminKostRow = Omit<AdminKost, "campuses" | "profiles"> & AdminKostRelation;

type AdminKostView = Omit<AdminKost, "campuses" | "profiles"> & {
  campus: {
    name: string;
  } | null;
  owner: {
    full_name: string;
  } | null;
};

function formatCreatedAt(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminKostPage() {
  const supabase = await createClient();
  const { data: kosts, error } = await supabase
    .from("kosts")
    .select(
      `
        id,
        name,
        status,
        price,
        created_at,
        campuses(name),
        profiles(full_name)
      `,
    )
    .eq("is_verified", false)
    .eq("status", pendingStatus)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const adminKosts: AdminKostView[] = ((kosts ?? []) as unknown as AdminKostRow[]).map(
    (kost) => ({
      id: kost.id,
      name: kost.name,
      status: kost.status,
      price: kost.price,
      created_at: kost.created_at,
      campus: getFirstRelation(kost.campuses),
      owner: getFirstRelation(kost.profiles),
    }),
  );

  return (
    <div className="space-y-6">
      <AdminKostToast />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Verifikasi Kos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tinjau kos yang masih menunggu verifikasi admin.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kos</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Kampus Terdekat</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {adminKosts.map((kost) => (
              <TableRow key={kost.id}>
                <TableCell className="font-medium">{kost.name}</TableCell>
                <TableCell>{kost.owner?.full_name ?? "-"}</TableCell>
                <TableCell>{kost.campus?.name ?? "-"}</TableCell>
                <TableCell>{formatRupiah(kost.price)}</TableCell>
                <TableCell>{formatCreatedAt(kost.created_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <form action={verifyKost}>
                      <input type="hidden" name="kost_id" value={kost.id} />
                      <Button type="submit" size="sm">
                        Verifikasi
                      </Button>
                    </form>

                    <form action={rejectKost}>
                      <input type="hidden" name="kost_id" value={kost.id} />
                      <Button type="submit" size="sm" variant="destructive">
                        Tolak
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {adminKosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Tidak ada kos yang menunggu verifikasi.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
