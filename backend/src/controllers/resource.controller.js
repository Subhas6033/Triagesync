import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  listResources,
  getResource,
  addResource,
  editResource,
  getResourceAvailability,
} from "../services/resource.service.js";

import {
  resourceListQuerySchema,
  updateResourceSchema,
} from "../validators/resource.validator.js";

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

  res.status(200).json(result);
});

export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await getResource(req.params.id);

  if (!resource.isActive && req.user.role !== "ADMIN") {
    throw new ApiError(404, "Resource not found", "NOT_FOUND");
  }

  res.status(200).json(resource);
});

export const createResource = asyncHandler(async (req, res) => {
  const resource = await addResource(req.body);

  res.status(201).json(resource);
});

export const updateResource = asyncHandler(async (req, res) => {
  await getResource(req.params.id);
  const parsed = updateResourceSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Request validation failed", "VALIDATION_ERROR");
  }

  const resource = await editResource(req.params.id, parsed.data);

  res.status(200).json(resource);
});

export const getResourceAvailabilityById = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (
    typeof from !== "string" ||
    typeof to !== "string" ||
    !from.endsWith("Z") ||
    !to.endsWith("Z") ||
    !Number.isFinite(Date.parse(from)) ||
    !Number.isFinite(Date.parse(to))
  ) {
    throw new ApiError(
      400,
      "Valid from and to query parameters are required",
      "VALIDATION_ERROR",
    );
  }

  const result = await getResourceAvailability(
    req.params.id,
    from,
    to,
    req.user.role === "ADMIN",
  );

  // Expose only the fields needed by the availability interface.
  res.status(200).json(result);
});
