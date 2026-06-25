"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { resetPassword } from "@/actions/auth/reset-password";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ResetPasswordInput } from "@/types/auth";
import { resetPasswordSchema } from "@/validations/auth";

export function ResetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setMessage(null);
    setServerError(null);

    const result = await resetPassword(values);

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
  }

  const isSubmitting = form.formState.isSubmitting;

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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password baru</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Ulangi password baru"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-11 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D]"
          disabled={isSubmitting || Boolean(message)}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? "Menyimpan..." : "Simpan password baru"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Password sudah diperbarui?{" "}
          <Link href="/auth/login" className="font-medium text-[#16A34A]">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
}
