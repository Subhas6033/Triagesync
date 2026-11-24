import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
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

import { bookingListQuerySchema } from "../validators/booking.validator.js";

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

  res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const filters = parseBookingFilters(req.query);
  const result = await listMyBookings(req.user.id, filters);

  res.status(200).json({
    success: true,
    message: "Your bookings fetched successfully",
    ...result,
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const filters = parseBookingFilters(req.query);
  const result = await listAllBookings(filters);

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    ...result,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await getBooking(req.params.id);

  if (req.user.role !== "ADMIN" && booking.userId !== req.user.id) {
    throw new ApiError(403, "You cannot view this booking", "FORBIDDEN");
  }

  res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await cancelBooking(req.params.id, req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

export const approveBookingByAdmin = asyncHandler(async (req, res) => {
  const booking = await approveBooking(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking approved successfully"));
});

export const rejectBookingByAdmin = asyncHandler(async (req, res) => {
  const booking = await rejectBooking(req.params.id, req.body.note);

  res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking rejected successfully"));
});
