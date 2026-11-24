import { prisma } from "../config/mysql.js";

import {
  lockResource,
  lockUser,
  findResourceById,
  countFutureUserBookings,
  findOverlappingBookings,
  createBooking,
} from "../repositories/mysql/booking.repository.js";

import ApiError from "../utils/ApiError.js";

export const createBookingSafely = async ({
  userId,
  resourceId,
  startTime,
  endTime,
  purpose,
  ticketId,
}) => {
  return prisma.$transaction(
    async (tx) => {
      // Lock in a consistent order to reduce deadlocks.
      await lockResource(tx, resourceId);
      await lockUser(tx, userId);

      const resource = await findResourceById(tx, resourceId);

      if (!resource || !resource.isActive) {
        throw new ApiError(404, "Active resource not found", "NOT_FOUND");
      }

      const now = new Date();

      const existingBookings = await countFutureUserBookings(tx, userId, now);

      if (existingBookings >= 3) {
        throw new ApiError(
          409,
          "You already have the maximum of 3 future bookings",
          "CONFLICT",
        );
      }

      const overlapping = await findOverlappingBookings(
        tx,
        resourceId,
        startTime,
        endTime,
      );

      if (overlapping.length > 0) {
        throw new ApiError(
          409,
          "This resource is already booked for the selected time",
          "CONFLICT",
        );
      }

      return createBooking(tx, {
        userId,
        resourceId,
        startTime,
        endTime,
        purpose,
        ticketId: ticketId ?? null,
        status: "PENDING",
      });
    },
    {
      maxWait: 10000,
      timeout: 15000,
    },
  );
};
