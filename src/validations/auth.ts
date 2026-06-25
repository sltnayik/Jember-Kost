import { z } from "zod";

const indonesianWhatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

export const loginSchema = z.object({
  email: z.email("Email tidak valid").trim().toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(3, "Nama minimal 3 karakter"),

    email: z
      .email("Email tidak valid")
      .trim()
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .regex(
        indonesianWhatsappRegex,
        "Nomor WhatsApp tidak valid"
      ),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter"),

    confirmPassword: z.string(),

    role: z.enum(["user", "owner"]),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Konfirmasi password tidak cocok",
    }
  );

export const emailSchema = z.object({
  email: z.email("Email tidak valid").trim().toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });
