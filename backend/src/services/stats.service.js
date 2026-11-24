import { prisma } from "../config/mysql.js";
import Ticket from "../models/mongodb/Ticket.model.js";

export const getAdminDashboardStats = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // MySQL metrics
  const [
    totalUsers,
    totalResources,
    activeResources,
    resourcesByType,
    bookingsByStatus,
    upcomingBookings,
    bookingsCreatedLast30Days,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.resource.count(),

    prisma.resource.count({
      where: { isActive: true },
    }),

    prisma.resource.groupBy({
      by: ["type"],
      _count: { _all: true },
    }),

    prisma.booking.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

    prisma.booking.count({
      where: {
        startTime: { gt: now },
        status: { in: ["PENDING", "APPROVED"] },
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  // MongoDB ticket metrics
  const [ticketMetrics] = await Ticket.aggregate([
    {
      $facet: {
        overview: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              reviewed: {
                $sum: { $cond: ["$isReviewed", 1, 0] },
              },
              modelAgreement: {
                $sum: {
                  $cond: [{ $eq: ["$category", "$autoCategory"] }, 1, 0],
                },
              },
            },
          },
        ],

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
      },
    },
  ]);

  const ticketOverview = ticketMetrics?.overview?.[0] ?? {
    total: 0,
    reviewed: 0,
    modelAgreement: 0,
  };

  const bookingStatusCounts = Object.fromEntries(
    bookingsByStatus.map((item) => [item.status, item._count._all]),
  );

  const totalBookings = bookingsByStatus.reduce(
    (total, item) => total + item._count._all,
    0,
  );

  const totalTickets = ticketOverview.total;

  const modelAgreementRate = totalTickets
    ? Number(((ticketOverview.modelAgreement / totalTickets) * 100).toFixed(2))
    : 0;

  return {
    generatedAt: now.toISOString(),

    overview: {
      totalUsers,
      totalResources,
      activeResources,
      inactiveResources: totalResources - activeResources,
      totalBookings,
      pendingBookings: bookingStatusCounts.PENDING ?? 0,
      approvedBookings: bookingStatusCounts.APPROVED ?? 0,
      rejectedBookings: bookingStatusCounts.REJECTED ?? 0,
      cancelledBookings: bookingStatusCounts.CANCELLED ?? 0,
      upcomingBookings,
      bookingsCreatedLast30Days,
      totalTickets,
      reviewedTickets: ticketOverview.reviewed,
      unreviewedTickets: totalTickets - ticketOverview.reviewed,
      modelAgreementRate,
    },

    tickets: {
      byCategory: ticketMetrics?.byCategory ?? [],
      byPriority: ticketMetrics?.byPriority ?? [],
      byStatus: ticketMetrics?.byStatus ?? [],
    },

    resources: {
      byType: resourcesByType.map((item) => ({
        type: item.type,
        count: item._count._all,
      })),
    },

    bookings: {
      byStatus: bookingsByStatus.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
    },
  };
};
