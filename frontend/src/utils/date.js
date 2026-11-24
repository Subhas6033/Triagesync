function validDate(value) {
  if (value == null || value === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
export function formatDate(value, options) {
  return validDate(value)?.toLocaleDateString(undefined, options) ?? "—";
}
export function formatDateTime(value) {
  return validDate(value)?.toLocaleString() ?? "—";
}
export function formatDateRange(start, end) {
  const first = validDate(start);
  const last = validDate(end);
  if (!first || !last) return "Date unavailable";
  const endLabel =
    first.toDateString() === last.toDateString()
      ? last.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : last.toLocaleString();
  return `${first.toLocaleString()} – ${endLabel}`;
}
export function toLocalDateTime(value = new Date()) {
  const date = validDate(value);
  if (!date) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export function availabilityWindow(value = new Date()) {
  const start = new Date(value);
  start.setHours(0, 0, 0, 0);
  // The API accepts UTC timestamps and a maximum elapsed duration of seven days.
  return {
    from: start.toISOString(),
    to: new Date(start.getTime() + 7 * 86400000).toISOString(),
  };
}
