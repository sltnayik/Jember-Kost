"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <h1 className="text-4xl font-bold">
          Terjadi Kesalahan
        </h1>

        <p className="text-muted-foreground mt-4">
          Silakan coba beberapa saat lagi.
        </p>

        <Button
          className="mt-8"
          onClick={() => reset()}
        >
          Coba Lagi
        </Button>

      </div>

    </div>
  );
}