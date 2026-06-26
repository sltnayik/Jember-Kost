import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null | undefined) {
  if (value == null) {
    return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function normalizeWhatsappNumber(value: string | null | undefined) {
  const digits = (value ?? "").replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("62")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+62${digits.slice(1)}`;
  }

  if (digits.startsWith("8")) {
    return `+62${digits}`;
  }

  return `+62${digits}`;
}
