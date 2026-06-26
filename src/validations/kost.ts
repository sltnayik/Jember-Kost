import { z } from "zod";

export const createKostSchema = z.object({
  name: z.string().min(5, "Nama kos minimal 5 karakter"),

  description: z.string().min(
    20,
    "Deskripsi minimal 20 karakter"
  ),

  gender_type: z.enum([
    "putra",
    "putri",
    "campur",
  ]),

  price: z.coerce.number().min(
    100000,
    "Harga minimal 100.000"
  ),

  address: z.string().min(
    10,
    "Alamat minimal 10 karakter"
  ),

  district: z.string().min(
    3,
    "Kecamatan wajib diisi"
  ),

  room_total: z.coerce.number().min(
    1,
    "Jumlah kamar minimal 1"
  ),

  whatsapp: z.string().min(
    10,
    "Nomor WhatsApp tidak valid"
  ),

  rules: z.string(),

  latitude: z.coerce.number({
    message: "Pilih lokasi kos pada peta",
  }),

  longitude: z.coerce.number({
    message: "Pilih lokasi kos pada peta",
  }),
});

export type CreateKostInput =
  z.infer<typeof createKostSchema>;

export const updateKostSchema = createKostSchema.extend({
  room_available: z.coerce.number().min(0, "Kamar tersedia tidak boleh negatif"),
}).refine((value) => value.room_available <= value.room_total, {
  message: "Kamar tersedia tidak boleh lebih besar dari jumlah kamar",
  path: ["room_available"],
});

export const updateRoomsSchema = z.object({
  room_total: z.coerce.number().min(1, "Jumlah kamar minimal 1"),
  room_available: z.coerce.number().min(0, "Kamar tersedia tidak boleh negatif"),
}).refine((value) => value.room_available <= value.room_total, {
  message: "Kamar tersedia tidak boleh lebih besar dari jumlah kamar",
  path: ["room_available"],
});

export type UpdateKostInput = z.infer<typeof updateKostSchema>;
export type UpdateRoomsInput = z.infer<typeof updateRoomsSchema>;
