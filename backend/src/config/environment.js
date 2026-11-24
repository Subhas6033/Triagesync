import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z
    .string()
    .default("24h")
    .refine((duration) => {
      const match = duration.match(/^(\d+)(s|m|h|d)$/i);
      if (!match) return false;
      const amount = Number(match[1]);
      const unitSeconds = { s: 1, m: 60, h: 3600, d: 86400 }[match[2].toLowerCase()];
      return amount > 0 && amount * unitSeconds <= 86400;
    }, "JWT expiration must be between 1 second and 24 hours"),
  CLIENT_URL: z.string().url(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:", result.error.flatten());
  process.exit(1);
}

export const env = result.data;
