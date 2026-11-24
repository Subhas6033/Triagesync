import { prisma } from "../config/mysql.js";
import Ticket from "../models/mongodb/Ticket.model.js";

const BOOKING_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

export const getAdminDashboardStats = async () => {
  const [
    activeResources,
    bookingStatusGroups,
    resourceBookingGroups,
  ] = await Promise.all([
    prisma.resource.count({
      where: { isActive: true },
    }),

    prisma.booking.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),

    prisma.booking.groupBy({
      by: ["resourceId"],
      _count: {
        _all: true,
      },
    }),
  ]);

  // Include every booking status, even when its count is zero.
  const bookingsByStatus = Object.fromEntries(
    BOOKING_STATUSES.map((status) => [status, 0]),
  );

  for (const item of bookingStatusGroups) {
    bookingsByStatus[item.status] = item._count._all;
  }

  // Rank resources by total bookings and retain the top three.
  const rankedResourceGroups = resourceBookingGroups
    .sort((a, b) => {
      const countDifference = b._count._all - a._count._all;

      if (countDifference !== 0) {
        return countDifference;
      }

      return a.resourceId.localeCompare(b.resourceId);
    })
    .slice(0, 3);

  const resourceIds = rankedResourceGroups.map(
    (item) => item.resourceId,
  );

  const resources = resourceIds.length
    ? await prisma.resource.findMany({
        where: {
          id: {
            in: resourceIds,
          },
        },
        select: {
          id: true,
          name: true,
          type: true,
        },
      })
    : [];

  const resourcesById = new Map(
    resources.map((resource) => [resource.id, resource]),
  );

  const topResources = rankedResourceGroups
    .map((item) => {
      const resource = resourcesById.get(item.resourceId);

      if (!resource) {
        return null;
      }

      return {
        id: resource.id,
        name: resource.name,
        type: resource.type,
        bookingCount: item._count._all,
      };
    })
    .filter(Boolean);

  // Aggregate ticket metrics in MongoDB.
  const [ticketMetrics] = await Ticket.aggregate([
    {
      $facet: {
        byCategory: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],

        byPriority: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],

        byStatus: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],

        reviewMetrics: [
          {
            $group: {
              _id: null,
              reviewedCount: {
                $sum: {
                  $cond: ["$isReviewed", 1, 0],
                },
              },
              agreementCount: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        "$isReviewed",
                        { $eq: ["$category", "$autoCategory"] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const reviewMetrics = ticketMetrics?.reviewMetrics?.[0] ?? {
    reviewedCount: 0,
    agreementCount: 0,
  };

  const reviewedCount = reviewMetrics.reviewedCount;

  const modelAgreementRate = reviewedCount
    ? Number(
        (
          (reviewMetrics.agreementCount / reviewedCount) *
          100
        ).toFixed(2),
      )
    : 0;

  return {
    activeResources,

    bookingsByStatus,

    topResources,

    ticketStats: {
      byCategory: (ticketMetrics?.byCategory ?? []).map((item) => ({
        category: item._id,
        count: item.count,
      })),

      byPriority: (ticketMetrics?.byPriority ?? []).map((item) => ({
        priority: item._id,
        count: item.count,
      })),

      byStatus: (ticketMetrics?.byStatus ?? []).map((item) => ({
        status: item._id,
        count: item.count,
      })),

      reviewedCount,
      modelAgreementRate,
    },
  };
};
