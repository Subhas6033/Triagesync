import ApiError from "../utils/ApiError.js";

import {
  findResources,
  countResources,
  findResourceById,
  createResource,
  updateResource,
  findResourceBookings,
} from "../repositories/mysql/resource.repository.js";

const handleResourceWriteError = (error) => {
  if (error.code === "P2002") {
    throw new ApiError(
      409,
      "A resource with this name already exists",
      "CONFLICT",
    );
  }

  if (error.code === "P2025") {
    throw new ApiError(404, "Resource not found", "NOT_FOUND");
  }

  throw error;
};

export const listResources = async (filters, isAdmin = false) => {
  const {
    page,
    pageSize,
    q,
    search,
    type,
    minCapacity,
  } = filters;

  const where = {};

  if (!isAdmin) {
    where.isActive = true;
  }

  if (type) where.type = type;

  if (minCapacity !== undefined) {
    where.capacity = { gte: minCapacity };
  }

  const searchTerm = search ?? q;

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm } },
      { description: { contains: searchTerm } },
      { location: { contains: searchTerm } },
    ];
  }

  const skip = (page - 1) * pageSize;

  const [resources, total] = await Promise.all([
    findResources(where, skip, pageSize),
    countResources(where),
  ]);

  return {
    data: resources,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getResource = async (id) => {
  const resource = await findResourceById(id);

  if (!resource) {
    throw new ApiError(404, "Resource not found", "NOT_FOUND");
  }

  return resource;
};

export const addResource = async (data) => {
  try {
    return await createResource({
      ...data,
      description: data.description ?? null,
      location: data.location ?? "",
      isActive: data.isActive ?? true,
    });
  } catch (error) {
    handleResourceWriteError(error);
  }
};

export const editResource = async (id, data) => {
  await getResource(id);

  try {
    return await updateResource(id, data);
  } catch (error) {
    handleResourceWriteError(error);
  }
};

export const getResourceAvailability = async (id, from, to, isAdmin = false) => {
  const resource = await getResource(id);

  if (!resource.isActive && !isAdmin) {
    throw new ApiError(404, "Resource not found", "NOT_FOUND");
  }

  const startTime = new Date(from);
  const endTime = new Date(to);

  if (
    Number.isNaN(startTime.getTime()) ||
    Number.isNaN(endTime.getTime()) ||
    startTime >= endTime
  ) {
    throw new ApiError(
      400,
      "Invalid availability date range",
      "VALIDATION_ERROR",
    );
  }

  if (endTime - startTime > 7 * 24 * 60 * 60 * 1000) {
    throw new ApiError(400, "Availability range cannot exceed 7 days", "VALIDATION_ERROR");
  }

  const bookings = await findResourceBookings(id, startTime, endTime);

  return {
    resourceId: id,
    from: startTime,
    to: endTime,
    bookings,
  };
};
