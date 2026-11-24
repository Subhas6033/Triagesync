import useListQuery from "../../../hooks/useListQuery";
import { RESOURCE_TYPES } from "../../../utils/constants";
import useToast from "../../../hooks/useToast";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createResource,
  getResource,
  getResourceAvailability,
  getResources,
  updateResource,
} from "../resources.api";
import queryKeys from "../../../lib/queryKeys";
import { rowsFrom, unwrapData } from "../../../utils/formatters";
import { availabilityWindow } from "../../../utils/date";
import useDebounce from "../../../hooks/useDebounce";
export function useResources(params = {}, { enabled = true } = {}) {
  return useListQuery({
    queryKey: queryKeys.resourceList,
    queryFn: getResources,
    params,
    enabled,
    collection: "resources",
  });
}
export function useResource(id) {
  return useQuery({
    queryKey: queryKeys.resource(id),
    queryFn: () => getResource(id),
    enabled: Boolean(id),
    select: unwrapData,
  });
}
export function useResourceAvailability(id, enabled = true) {
  const { from, to } = availabilityWindow();
  return useQuery({
    queryKey: [...queryKeys.availability(id), from, to],
    queryFn: () => getResourceAvailability(id, from, to),
    enabled: Boolean(id) && enabled,
    select: (data) => {
      const result = unwrapData(data);
      return rowsFrom(
        result,
        Array.isArray(result?.slots) ? "slots" : "bookings",
      );
    },
  });
}
export function useResourceMutations() {
  const client = useQueryClient();
  const toast = useToast();
  const refresh = async () => {
    toast("Changes saved successfully.");
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.resources }),
      client.invalidateQueries({ queryKey: queryKeys.bookings }),
      client.invalidateQueries({ queryKey: queryKeys.dashboard }),
    ]);
  };
  const save = useMutation({
    mutationFn: ({ id, ...values }) =>
      id != null ? updateResource({ id, ...values }) : createResource(values),
    onSuccess: refresh,
  });
  const toggle = useMutation({
    mutationFn: (resource) =>
      updateResource({
        id: resource.id,
        isActive: resource.isActive === false,
      }),
    onSuccess: refresh,
  });
  return { save, toggle };
}
export function useResourceList() {
  const [search, setSearchValue] = useState("");
  const [type, setTypeValue] = useState("");
  const [minCapacity, setMinCapacityValue] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search);
  const query = useResources({ q: debounced, type, minCapacity, page, pageSize: 10 });
  if (query.isSuccess && page > query.pages) setPage(query.pages);
  function setSearch(value) {
    setSearchValue(value);
    setPage(1);
  }
  function setType(value) {
    setTypeValue(value);
    setPage(1);
  }
  function setMinCapacity(value) {
    setMinCapacityValue(value);
    setPage(1);
  }
  return {
    query,
    search,
    setSearch,
    type,
    setType,
    minCapacity,
    setMinCapacity,
    types: RESOURCE_TYPES,
    filtered: query.data || [],
    setPage,
  };
}
