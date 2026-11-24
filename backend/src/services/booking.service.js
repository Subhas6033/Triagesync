import mongoose from "mongoose";

import { prisma } from "../config/mysql.js";
import { findTicketById } from "../repositories/mongodb/ticket.repository.js";
import ApiError from "../utils/ApiError.js";
import { createBookingSafely } from "./concurrency.service.js";
import { lockBooking } from "../repositories/mysql/booking.repository.js";

const ACTIVE_STATUSES = ["PENDING", "APPROVED"];

const validateBookingTime = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    throw new ApiError(400, "Invalid booking date range", "VALIDATION_ERROR");
  }

  const validSlot = (date) =>
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0 &&
    date.getUTCMinutes() % 30 === 0;

  if (!validSlot(start) || !validSlot(end)) {
    throw new ApiError(
      400,
      "Booking times must be on 30-minute boundaries with zero seconds",
      "VALIDATION_ERROR",
    );
  }

  const durationMinutes = (end - start) / 60000;

  if (durationMinutes < 30 || durationMinutes > 240) {
    throw new ApiError(
      400,
      "Booking duration must be between 30 and 240 minutes",
      "VALIDATION_ERROR",
    );
  }

  if (start <= now) {
    throw new ApiError(
      400,
      "Booking must start in the future",
      "VALIDATION_ERROR",
    );
  }

  const maximumStart = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  if (start > maximumStart) {
    throw new ApiError(
      400,
      "Bookings cannot start more than 30 days in advance",
      "VALIDATION_ERROR",
    );
  }

  return { start, end };
};

export const createBooking = async (userId, data) => {
  const { start, end } = validateBookingTime(data.startTime, data.endTime);

  if (data.ticketId) {
    if (!mongoose.isValidObjectId(data.ticketId)) {
      throw new ApiError(404, "Ticket not found", "NOT_FOUND");
    }

    const ticket = await findTicketById(data.ticketId);

    if (!ticket) {
      throw new ApiError(404, "Ticket not found", "NOT_FOUND");
    }
  }

  return createBookingSafely({
    userId,
    resourceId: data.resourceId,
    startTime: start,
    endTime: end,
    purpose: data.purpose,
    ticketId: data.ticketId,
  });
};

export const listMyBookings = async (userId, filters) => {
  const { page, pageSize, status } = filters;

  const where = {
    userId,
    ...(status ? { status } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        resource: {
          select: {
            id: true,
            name: true,
            type: true,
            location: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const listAllBookings = async (filters) => {
  const { page, pageSize, status, resourceId, startDate, endDate } = filters;

  const where = {
    ...(status ? { status } : {}),
    ...(resourceId ? { resourceId } : {}),
    ...(startDate && endDate
      ? {
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        resource: {
          select: {
            id: true,
            name: true,
            type: true,
            location: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    data,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getBooking = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      resource: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found", "NOT_FOUND");
  }

  return booking;
};

export const cancelBooking = async (id, userId) => {
  return prisma.$transaction(async (tx) => {
    await lockBooking(tx, id);
    const booking = await tx.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new ApiError(404, "Booking not found", "NOT_FOUND");
    }

    if (booking.userId !== userId) {
      throw new ApiError(403, "You cannot cancel this booking", "FORBIDDEN");
    }

    if (
      !ACTIVE_STATUSES.includes(booking.status) ||
      booking.startTime <= new Date()
    ) {
      throw new ApiError(
        409,
        "This booking can no longer be cancelled",
        "CONFLICT",
      );
    }

    return tx.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  });
};

export const approveBooking = async (id) => {
  return prisma.$transaction(async (tx) => {
    await lockBooking(tx, id);
    const booking = await tx.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new ApiError(404, "Booking not found", "NOT_FOUND");
    }

    if (booking.status !== "PENDING" || booking.startTime <= new Date()) {
      throw new ApiError(
        409,
        "Only future pending bookings can be approved",
        "CONFLICT",
      );
    }

    return tx.booking.update({
      where: { id },
      data: { status: "APPROVED" },
    });
  });
};

export const rejectBooking = async (id, note) => {
  return prisma.$transaction(async (tx) => {
    // Lock the booking row before reading its current status.
    await lockBooking(tx, id);

    const booking = await tx.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new ApiError(404, "Booking not found", "NOT_FOUND");
    }

    if (booking.status !== "PENDING" || booking.startTime <= new Date()) {
      throw new ApiError(
        409,
        "Only future pending bookings can be rejected",
        "CONFLICT",
      );
    }

    return tx.booking.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionNote: note,
      },
    });
  });
};
