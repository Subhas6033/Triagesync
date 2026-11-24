import { useQuery } from "@tanstack/react-query";
import { listPage } from "../utils/formatters";
import { PAGE_SIZE } from "../utils/constants";
export default function useListQuery({
  queryKey,
  queryFn,
  params = {},
  collection,
  enabled = true,
}) {
  const filters = Object.fromEntries(
    Object.entries({ page: 1, pageSize: PAGE_SIZE, ...params }).filter(
      ([, value]) => value !== "" && value !== undefined,
    ),
  );
  const query = useQuery({
    queryKey: [...queryKey, filters],
    queryFn: () => queryFn(filters),
    enabled,
    select: (response) => listPage(response, collection, filters),
  });
  return {
    ...query,
    data: query.data?.items,
    total: query.data?.total ?? 0,
    page: query.data?.page ?? filters.page,
    pageSize: filters.pageSize,
    pages: query.data?.pages ?? 1,
  };
}
