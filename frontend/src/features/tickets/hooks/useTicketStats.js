import { useQuery } from "@tanstack/react-query";
import { getTicketStats } from "../tickets.api";
import queryKeys from "../../../lib/queryKeys";
import { unwrapData } from "../../../utils/formatters";
export default function useTicketStats({
  enabled = true,
  stats: provided,
} = {}) {
  const query = useQuery({
    queryKey: queryKeys.ticketStats,
    queryFn: getTicketStats,
    enabled,
    select: unwrapData,
  });
  const response = provided ?? query.data;
  const stats = response?.ticketStats ?? response ?? {};
  return {
    ...query,
    stats,
    categories: stats.categoryCounts || stats.byCategory || [],
    priorities: stats.priorityCounts || stats.byPriority || [],
  };
}
