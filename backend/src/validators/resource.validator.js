import { z } from "zod";

const resourceTypes = ["ROOM", "LAB", "EQUIPMENT"];

export const createResourceSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().min(5).max(2000),
    type: z.enum(resourceTypes),
    capacity: z.coerce.number().int().min(1).max(10000),
    location: z.string().trim().min(2).max(200),
    isActive: z.boolean().optional(),
  })
  .strict();

export const updateResourceSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(5).max(2000).optional(),
    type: z.enum(resourceTypes).optional(),
    capacity: z.coerce.number().int().min(1).max(10000).optional(),
    location: z.string().trim().min(2).max(200).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const resourceListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    q: z.string().trim().max(200).optional(),
    type: z.enum(resourceTypes).optional(),
    minCapacity: z.coerce.number().int().min(1).optional(),
    includeInactive: z.enum(["true", "false"]).default("false"),
  })
  .strict();
