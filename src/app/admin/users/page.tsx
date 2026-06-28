import { Badge } from "@/components/ui/badge";
import { DeleteUserButton } from "./delete-user-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "owner" | "user" | null;
  created_at: string | null;
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

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Pengguna</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Daftar akun yang terdaftar di JemberKost.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {((users ?? []) as AdminUser[]).map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role ?? "-"}</Badge>
                </TableCell>
                <TableCell>{formatCreatedAt(user.created_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DeleteUserButton userId={user.id} userName={user.full_name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
