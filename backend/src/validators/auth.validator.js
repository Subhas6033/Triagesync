import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(50),

    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(8)
      .max(64)
      .regex(/[A-Za-z]/, "Password must contain a letter")
      .regex(/[0-9]/, "Password must contain a digit"),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),

    password: z.string().min(1).max(64),
  })
  .strict();
