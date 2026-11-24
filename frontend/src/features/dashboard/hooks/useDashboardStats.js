import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../dashboard.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { useTickets } from "../../tickets/hooks/useTickets";
import useTicketStats from "../../tickets/hooks/useTicketStats";
import { useResources } from "../../resources/hooks/useResources";
import { useBookings } from "../../bookings/hooks/useBookings";
import queryKeys from "../../../lib/queryKeys";
import {
  chartEntries,
  unwrapData,
  ticketTotalFromStats,
} from "../../../utils/formatters";
export default function useDashboardStats() {
  const { isAdmin } = useAuth();
  const admin = useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: getDashboardStats,
    enabled: isAdmin,
    select: unwrapData,
  });
  const tickets = useTickets();
  const resources = useResources();
  const pending = useBookings({
    admin: isAdmin,
    status: "PENDING",
    enabled: !isAdmin || admin.isError,
  });
  const approved = useBookings({
    admin: isAdmin,
    status: "APPROVED",
    enabled: !isAdmin || admin.isError,
  });
  const rejected = useBookings({
    admin: isAdmin,
    status: "REJECTED",
    enabled: !isAdmin || admin.isError,
  });
  const cancelled = useBookings({
    admin: isAdmin,
    status: "CANCELLED",
    enabled: !isAdmin || admin.isError,
  });
  const bookingQueries = [pending, approved, rejected, cancelled];
  const bookingDataReady =
    Boolean(admin.data?.bookingsByStatus) ||
    bookingQueries.every((query) => query.isSuccess);
  const ticketStats = useTicketStats({
    enabled: !isAdmin || admin.isError,
    stats: isAdmin ? admin.data : undefined,
  });
  const primary = isAdmin && !admin.isError ? admin : ticketStats;
  const stats = ticketStats.stats;
  const bookingCounts = admin.data?.bookingsByStatus || {
    PENDING: pending.total,
    APPROVED: approved.total,
    REJECTED: rejected.total,
    CANCELLED: cancelled.total,
  };
  const bookingsTotal = chartEntries(bookingCounts).reduce(
    (sum, [, value]) => sum + value,
    0,
  );
  const recent = [...(tickets.data || [])]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);
  const sources = [
    ["Statistics", primary],
    ...(isAdmin && admin.isError ? [["Administrator statistics", admin]] : []),
    ["Tickets", tickets],
    ["Resources", resources],
    ...(!isAdmin || admin.isError
      ? [
          ["Pending bookings", pending],
          ["Approved bookings", approved],
          ["Rejected bookings", rejected],
          ["Cancelled bookings", cancelled],
        ]
      : []),
  ];
  const errors = sources
    .filter(([, query]) => query.isError)
    .map(([name, query]) => ({
      name,
      error: query.error,
      retry: query.refetch,
    }));
  return {
    isPending: sources.some(([, query]) => query.isPending),
    errors,
    stats,
    categories: ticketStats.categories,
    priorities: ticketStats.priorities,
    recent,
    bookingCounts,
    bookingsTotal: bookingDataReady ? bookingsTotal : null,
    resourceTotal: resources.isSuccess ? resources.total : null,
    activeResources:
      admin.data?.activeResources ??
      (resources.isSuccess ? (isAdmin ? null : resources.total) : null),
    ticketTotal: tickets.isSuccess
      ? (ticketTotalFromStats(stats) ?? tickets.total)
      : null,
    pendingBookings: bookingDataReady
      ? Object.fromEntries(chartEntries(bookingCounts)).PENDING || 0
      : null,
    topResources:
      admin.data?.topResources?.map((resource) => ({
        name: resource.name,
        count: resource.bookingCount,
      })) ?? [],
  };
}
