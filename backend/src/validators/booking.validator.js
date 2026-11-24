import { z } from "zod";

export const createBookingSchema = z
  .object({
    resourceId: z.string().trim().min(1),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    purpose: z.string().trim().min(5).max(200),
    ticketId: z.string().trim().min(1).optional(),
  })
  .strict();

export const bookingListQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
    resourceId: z.string().trim().min(1).optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
  })
  .strict()
  .refine(
    (data) => Boolean(data.from) === Boolean(data.to),
    {
      message: "Both from and to must be provided together",
    },
  )
  .refine(
    (data) =>
      !data.from ||
      !data.to ||
      new Date(data.from) < new Date(data.to),
    {
      message: "from must be before to",
    },
  );

export const rejectBookingSchema = z
  .object({
    note: z.string().trim().min(5).max(200),
  })
  .strict();
