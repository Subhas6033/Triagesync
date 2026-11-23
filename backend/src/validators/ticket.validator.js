import { z } from "zod";

const categories = ["BILLING", "LOGIN", "DELIVERY", "BUG", "FEATURE_REQUEST"];

const priorities = ["URGENT", "HIGH", "MEDIUM", "LOW"];

const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const ticketInputSchema = z
  .object({
    externalId: z.string().trim().min(1).max(100),
    subject: z.string().trim().min(1).max(300),
    body: z.string().min(1).max(10000),
  })
  .strict();

export const importTicketsSchema = z
  .object({
    tickets: z.array(ticketInputSchema).min(1).max(500),
  })
  .strict();

export const updateTicketSchema = z
  .object({
    category: z.enum(categories).optional(),
    priority: z.enum(priorities).optional(),
    status: z.enum(statuses).optional(),
    assigneeId: z.string().trim().min(1).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const ticketListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(statuses).optional(),
    category: z.enum(categories).optional(),
    priority: z.enum(priorities).optional(),
    q: z.string().trim().max(200).optional(),
  })
  .strict();
