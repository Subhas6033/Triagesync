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
    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),
  })
  .strict()
  .refine(
    (data) => Boolean(data.startDate) === Boolean(data.endDate),
    {
      message: "Both startDate and endDate must be provided together",
    },
  )
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate) <= new Date(data.endDate),
    {
      message: "startDate must be before or equal to endDate",
    },
  );

export const rejectBookingSchema = z
  .object({
    note: z.string().trim().min(5).max(200),
  })
  .strict();
