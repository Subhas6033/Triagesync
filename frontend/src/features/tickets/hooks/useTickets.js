import useToast from "../../../hooks/useToast";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTicket,
  getTickets,
  importTickets,
  updateTicket,
} from "../tickets.api";
import queryKeys from "../../../lib/queryKeys";
import { unwrapData } from "../../../utils/formatters";
import useListQuery from "../../../hooks/useListQuery";
import useDebounce from "../../../hooks/useDebounce";

export function useTickets(params = {}) {
  return useListQuery({
    queryKey: queryKeys.ticketList,
    queryFn: getTickets,
    params,
    collection: "tickets",
  });
}
export function useTicket(id) {
  return useQuery({
    queryKey: queryKeys.ticket(id),
    queryFn: () => getTicket(id),
    select: unwrapData,
    enabled: Boolean(id),
  });
}
export function useTicketMutations() {
  const client = useQueryClient();
  const toast = useToast();
  const refresh = async () => {
    toast("Changes saved successfully.");
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.tickets }),
      client.invalidateQueries({ queryKey: queryKeys.dashboard }),
    ]);
  };
  const update = useMutation({
    mutationFn: updateTicket,
    onMutate: async ({ id, ...changes }) => {
      const key = queryKeys.ticket(id);
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData(key);
      if (previous?.ticket) {
        const categoryChanged = changes.category != null && changes.category !== previous.ticket.category;
        const statusChangedFromOpen = changes.status != null && changes.status !== previous.ticket.status && previous.ticket.status === "OPEN";
        client.setQueryData(key, {
          ...previous,
          ticket: {
            ...previous.ticket,
            ...changes,
            isHumanOverride: categoryChanged ? true : previous.ticket.isHumanOverride,
            isReviewed: categoryChanged || statusChangedFromOpen ? true : previous.ticket.isReviewed,
          },
        });
      }
      return { key, previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) client.setQueryData(context.key, context.previous);
      toast(`Ticket update failed: ${error?.response?.data?.error?.message || error?.message || "Please try again."}`, "error");
    },
    onSuccess: refresh,
    onSettled: (_data, _error, variables) => {
      client.invalidateQueries({ queryKey: queryKeys.ticket(variables.id) });
    },
  });
  const importBatch = useMutation({
    mutationFn: importTickets,
    onSuccess: async (result) => {
      toast(`Feed import complete: ${result.importedCount} imported, ${result.updatedCount} updated, ${result.skippedOverrideCount} human overrides preserved.`);
      await Promise.all([
        client.invalidateQueries({ queryKey: queryKeys.tickets }),
        client.invalidateQueries({ queryKey: queryKeys.dashboard }),
      ]);
    },
  });
  return { update, importBatch };
}
export function useTicketList() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const query = useTickets({ q: debouncedSearch, ...filters, page });
  if (query.isSuccess && page > query.pages) setPage(query.pages);
  function changeFilters(next) {
    setFilters(next);
    setPage(1);
  }
  function submitSearch() {
    setPage(1);
  }
  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }
  return {
    query,
    search,
    setSearch: changeSearch,
    submitSearch,
    filters,
    changeFilters,
    setPage,
    pagination: {
      page: query.page,
      total: query.total,
      items: query.data || [],
    },
  };
}
