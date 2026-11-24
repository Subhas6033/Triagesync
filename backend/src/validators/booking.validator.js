import { z } from "zod";

export const createBookingSchema = z
  .object({
    resourceId: z.string().trim().min(1),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    purpose: z.string().trim().min(5).max(1000),
    ticketId: z.string().trim().min(1).optional(),
  })
  .strict();

export const bookingListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  })
  .strict();

export const rejectBookingSchema = z
  .object({
    note: z.string().trim().min(3).max(1000),
  })
  .strict();
