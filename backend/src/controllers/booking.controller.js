import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  createBooking as createBookingService,
  listMyBookings,
  listAllBookings,
  getBooking,
  cancelBooking,
  approveBooking,
  rejectBooking,
} from "../services/booking.service.js";

import {
  bookingListQuerySchema,
  rejectBookingSchema,
} from "../validators/booking.validator.js";

const parseBookingFilters = (query) => {
  const parsed = bookingListQuerySchema.safeParse(query);

  if (!parsed.success) {
    throw new ApiError(
      400,
      "Invalid booking filters or pagination",
      "VALIDATION_ERROR",
    );
  }

  return parsed.data;
};

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await createBookingService(req.user.id, req.body);

  res.status(201).json(booking);
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const filters = parseBookingFilters(req.query);
  const result = await listMyBookings(req.user.id, filters);

  res.status(200).json(result);
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const filters = parseBookingFilters(req.query);
  const result = await listAllBookings(filters);

  res.status(200).json(result);
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await getBooking(req.params.id);

  if (req.user.role !== "ADMIN" && booking.userId !== req.user.id) {
    throw new ApiError(403, "You cannot view this booking", "FORBIDDEN");
  }

  res.status(200).json(booking);
});

export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await cancelBooking(req.params.id, req.user.id);

  res.status(200).json(booking);
});

export const approveBookingByAdmin = asyncHandler(async (req, res) => {
  const booking = await approveBooking(req.params.id);

  res.status(200).json(booking);
});

export const rejectBookingByAdmin = asyncHandler(async (req, res) => {
  await getBooking(req.params.id);
  const parsed = rejectBookingSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Request validation failed", "VALIDATION_ERROR");
  }

  const booking = await rejectBooking(req.params.id, parsed.data.note);

  res.status(200).json(booking);
});
