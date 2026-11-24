export const formatLabel = (value) => String(value ?? "—").replaceAll("_", " ");
export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}
export function unwrapData(value) {
  // API services already remove the Axios response envelope.
  while (value && !Array.isArray(value) && value.data != null)
    value = value.data;
  return value;
}
export function rowsFrom(value, key) {
  const result = unwrapData(value);
  if (Array.isArray(result)) return result;
  const rows = result?.[key] ?? result?.items;
  return Array.isArray(rows) ? rows : [];
}
export function chartEntries(values) {
  return (
    Array.isArray(values)
      ? values.map((item) => [
          item.category ??
            item.priority ??
            item.status ??
            item.name ??
            item.label ??
            "Other",
          item.count ?? item.total ?? item.value ?? 0,
        ])
      : Object.entries(values || {}).map(([label, value]) => [
          label,
          typeof value === "object" && value !== null
            ? (value.count ?? value.total ?? value.value ?? 0)
            : value,
        ])
  )
    .filter(([, value]) => Number.isFinite(Number(value)) && Number(value) >= 0)
    .map(([label, value]) => [label, Number(value)]);
}
export function listPage(response, key, { page = 1, pageSize = 8 } = {}) {
  let envelope = response;
  while (
    envelope?.data &&
    !Array.isArray(envelope.data) &&
    envelope.total == null
  )
    envelope = envelope.data;
  const items = rowsFrom(response, key);
  const total = Number.isFinite(envelope?.total)
    ? envelope.total
    : items.length;
  return {
    items,
    total,
    page: envelope?.page ?? page,
    pageSize: envelope?.pageSize ?? pageSize,
    pages: Math.max(1, Math.ceil(total / (envelope?.pageSize ?? pageSize))),
  };
}
export function ticketTotalFromStats(stats) {
  const counts = stats?.byStatus ?? stats?.byCategory;
  return counts
    ? chartEntries(counts).reduce((sum, [, value]) => sum + value, 0)
    : null;
}
