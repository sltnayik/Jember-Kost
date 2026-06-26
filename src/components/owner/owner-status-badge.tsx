import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/services/owner.service";

const statusConfig: Record<VerificationStatus, { label: string; dot: string; className: string }> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  approved: {
    label: "Approved",
    dot: "bg-[#16A34A]",
    className: "border-green-200 bg-green-50 text-green-700",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-500",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

export function OwnerStatusBadge({ status }: { status: VerificationStatus }) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("h-7 rounded-full px-3", config.className)}>
      <span className={cn("size-2 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  );
}
