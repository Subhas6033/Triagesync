import ApiError from "../utils/ApiError.js";

import {
  findResources,
  countResources,
  findResourceById,
  createResource,
  updateResource,
  findResourceBookings,
} from "../repositories/mysql/resource.repository.js";

export const listResources = async (filters, isAdmin = false) => {
  const { page, pageSize, q, type, minCapacity, includeInactive } = filters;

  const where = {
    isActive: !(isAdmin && includeInactive === "true"),
  };

  if (type) where.type = type;

  if (minCapacity !== undefined) {
    where.capacity = { gte: minCapacity };
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { location: { contains: q } },
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
  return createResource({
    ...data,
    isActive: data.isActive ?? true,
  });
};

export const editResource = async (id, data) => {
  await getResource(id);

  return updateResource(id, data);
};

export const getResourceAvailability = async (id, startDate, endDate) => {
  const resource = await getResource(id);

  if (!resource.isActive) {
    throw new ApiError(409, "This resource is currently inactive", "CONFLICT");
  }

  const startTime = new Date(startDate);
  const endTime = new Date(endDate);

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

  const bookings = await findResourceBookings(id, startTime, endTime);

  return {
    resourceId: id,
    startTime,
    endTime,
    bookings,
  };
};
