import { prisma } from "../../config/mysql.js";

export const lockResource = async (tx, resourceId) => {
  return tx.$queryRaw`
    SELECT id
    FROM Resource
    WHERE id = ${resourceId}
    FOR UPDATE
  `;
};

export const lockUser = async (tx, userId) => {
  return tx.$queryRaw`
    SELECT id
    FROM User
    WHERE id = ${userId}
    FOR UPDATE
  `;
};

export const findResourceById = (tx, id) =>
  tx.resource.findUnique({
    where: { id },
  });

export const countFutureUserBookings = (tx, userId, now) =>
  tx.booking.count({
    where: {
      userId,
      status: { in: ["PENDING", "APPROVED"] },
      startTime: { gt: now },
    },
  });

export const findOverlappingBookings = (tx, resourceId, startTime, endTime) =>
  tx.booking.findMany({
    where: {
      resourceId,
      status: { in: ["PENDING", "APPROVED"] },
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
    select: { id: true },
  });

export const createBooking = (tx, data) => tx.booking.create({ data });

export const findBookingById = (id) =>
  prisma.booking.findUnique({
    where: { id },
    include: {
      resource: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
