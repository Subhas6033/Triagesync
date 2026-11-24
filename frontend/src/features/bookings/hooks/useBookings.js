import useToast from "../../../hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveBooking,
  cancelBooking,
  createBooking,
  getBookings,
  getMyBookings,
  rejectBooking,
} from "../bookings.api";
import queryKeys from "../../../lib/queryKeys";
import { useState } from "react";
import useListQuery from "../../../hooks/useListQuery";
export function useBookings({ admin = false, enabled = true, ...params } = {}) {
  return useListQuery({
    queryKey: admin ? queryKeys.adminBookings : queryKeys.myBookings,
    queryFn: admin ? getBookings : getMyBookings,
    params,
    enabled,
    collection: "bookings",
  });
}
export function useBookingList({ admin = false } = {}) {
  const [filter, setFilterValue] = useState(admin ? "PENDING" : "ALL");
  const [page, setPage] = useState(1);
  const query = useBookings({
    admin,
    page,
    status: filter === "ALL" ? undefined : filter,
  });
  if (query.isSuccess && page > query.pages) setPage(query.pages);
  function setFilter(value) {
    setFilterValue(value);
    setPage(1);
  }
  return { query, filter, setFilter, setPage };
}
export function useBookingMutations() {
  const client = useQueryClient();
  const toast = useToast();
  // A decision affects both booking views, availability, and dashboard counts.
  const refresh = async () => {
    toast("Changes saved successfully.");
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.bookings }),
      client.invalidateQueries({ queryKey: queryKeys.allAvailability }),
      client.invalidateQueries({ queryKey: queryKeys.dashboard }),
    ]);
  };
  const create = useMutation({ mutationFn: createBooking, onSuccess: refresh });
  const approve = useMutation({
    mutationFn: approveBooking,
    onSuccess: refresh,
  });
  const reject = useMutation({ mutationFn: rejectBooking, onSuccess: refresh });
  const cancel = useMutation({ mutationFn: cancelBooking, onSuccess: refresh });
  return { create, approve, reject, cancel };
}
