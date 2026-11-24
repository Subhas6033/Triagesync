import { prisma } from "../../config/mysql.js";

export const findResources = (where, skip, take) =>
  prisma.resource.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

export const countResources = (where) => prisma.resource.count({ where });

export const findResourceById = (id) =>
  prisma.resource.findUnique({ where: { id } });

export const createResource = (data) => prisma.resource.create({ data });

export const updateResource = (id, data) =>
  prisma.resource.update({
    where: { id },
    data,
  });

export const findResourceBookings = (resourceId, startTime, endTime) =>
  prisma.booking.findMany({
    where: {
      resourceId,
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      status: { in: ["PENDING", "APPROVED"] },
    },
    select: {
      startTime: true,
      endTime: true,
      status: true,
    },
    orderBy: { startTime: "asc" },
  });
