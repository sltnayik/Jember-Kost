import Link from "next/link";
import { House } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <div className="bg-emerald-600 p-2 rounded-2xl">
        <House className="w-6 h-6 text-white" />
      </div>

      <div>
        <h1 className="font-bold text-xl">
          JemberKost
        </h1>

        <p className="text-xs text-muted-foreground">
          Find Your Best Stay
        </p>
      </div>
    </Link>
  );
}