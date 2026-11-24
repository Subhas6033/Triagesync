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
export function formatRelativeDateTime(value, now = new Date()) {
  const date = validDate(value);
  if (!date) return "Time unavailable";
  const seconds = (date.getTime() - now.getTime()) / 1000;
  const choices = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  const [divisor, unit] = choices.find(([limit]) => Math.abs(seconds) >= limit) || choices[choices.length - 1];
  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(Math.round(seconds / divisor), unit);
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
