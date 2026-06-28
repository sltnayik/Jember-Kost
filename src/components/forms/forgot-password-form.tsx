"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { forgotPassword } from "@/actions/auth/forgot-password";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { EmailInput } from "@/types/auth";
import { emailSchema } from "@/validations/auth";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number | null>(null);
  const pendingRef = useRef(false);

  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: EmailInput) {
    setMessage(null);
    setServerError(null);

    // Prevent re-entrancy if a submission is already in progress
    if (pendingRef.current) return;

    // Cooldown per email to avoid hitting Supabase rate limits from the client
    try {
      const key = `forgot-password:last:${values.email}`;
      const raw = sessionStorage.getItem(key);
      const last = raw ? Number(raw) : 0;
      const now = Date.now();
      const MIN_MS = 60_000; // 60 seconds

      if (last && now - last < MIN_MS) {
        const remaining = Math.ceil((MIN_MS - (now - last)) / 1000);
        const msg = `Tunggu ${remaining} detik sebelum mencoba lagi.`;
        setServerError(msg);
        toast.error(msg);
        return;
      }

      pendingRef.current = true;
      const result = await forgotPassword(values);
      // record attempt timestamp even if it failed to avoid immediate retries
      try {
        sessionStorage.setItem(key, String(now));
        setCooldown(now + MIN_MS);
      } catch {}
      pendingRef.current = false;

      if (result.error) {
        setServerError(result.error);
        toast.error(result.error);
        return;
      }

      if (result.success) {
        setMessage(result.success);
        toast.success(result.success);
        form.reset();
      }
    } finally {
      pendingRef.current = false;
    }
  }

  const isSubmitting = form.formState.isSubmitting;
  const isCooling = (() => {
    if (!cooldown) return false;
    return Date.now() < cooldown;
  })();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        {serverError ? (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}

        {message ? (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email akun</FormLabel>
              <FormControl>
                <Input type="email" placeholder="nama@email.com" autoComplete="email" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D]" disabled={isSubmitting || isCooling}>
          {isSubmitting || pendingRef.current ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting || isCooling ? "Mengirim..." : "Kirim link reset"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ingat password?{" "}
          <Link href="/auth/login" className="font-medium text-[#16A34A]">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}
