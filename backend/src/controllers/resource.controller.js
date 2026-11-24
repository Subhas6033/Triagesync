import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  listResources,
  getResource,
  addResource,
  editResource,
  getResourceAvailability,
} from "../services/resource.service.js";

import { resourceListQuerySchema } from "../validators/resource.validator.js";

export const getResources = asyncHandler(async (req, res) => {
  const parsed = resourceListQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      400,
      "Invalid resource filters or pagination",
      "VALIDATION_ERROR",
    );
  }

  const result = await listResources(parsed.data, req.user.role === "ADMIN");

  res.status(200).json({
    success: true,
    message: "Resources fetched successfully",
    ...result,
  });
});

export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await getResource(req.params.id);

  if (!resource.isActive && req.user.role !== "ADMIN") {
    throw new ApiError(404, "Resource not found", "NOT_FOUND");
  }

  res
    .status(200)
    .json(new ApiResponse(200, resource, "Resource fetched successfully"));
});

export const createResource = asyncHandler(async (req, res) => {
  const resource = await addResource(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, resource, "Resource created successfully"));
});

export const updateResource = asyncHandler(async (req, res) => {
  const resource = await editResource(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, resource, "Resource updated successfully"));
});

export const getResourceAvailabilityById = asyncHandler(async (req, res) => {
  const { startTime, endTime } = req.query;

  if (
    typeof startTime !== "string" ||
    typeof endTime !== "string" ||
    !Number.isFinite(Date.parse(startTime)) ||
    !Number.isFinite(Date.parse(endTime))
  ) {
    throw new ApiError(
      400,
      "Valid startTime and endTime query parameters are required",
      "VALIDATION_ERROR",
    );
  }

  const result = await getResourceAvailability(
    req.params.id,
    startTime,
    endTime,
  );

  // Expose only the fields needed by the availability interface.
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Resource availability fetched successfully",
      ),
    );
});
