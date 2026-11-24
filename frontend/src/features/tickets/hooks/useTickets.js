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
  const update = useMutation({ mutationFn: updateTicket, onSuccess: refresh });
  const importBatch = useMutation({
    mutationFn: importTickets,
    onSuccess: refresh,
  });
  return { update, importBatch };
}
export function useTicketList() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [page, setPage] = useState(1);
  const query = useTickets({ q: submittedSearch, ...filters, page });
  if (query.isSuccess && page > query.pages) setPage(query.pages);
  function changeFilters(next) {
    setFilters(next);
    setPage(1);
  }
  function submitSearch() {
    setSubmittedSearch(search);
    setPage(1);
  }
  return {
    query,
    search,
    setSearch,
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
