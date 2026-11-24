export function parseTicketImport(text) {
  const parsed = JSON.parse(text);
  const tickets = Array.isArray(parsed) ? parsed : parsed?.tickets;
  if (!Array.isArray(tickets))
    throw new Error("Import expects a JSON file containing a tickets array.");
  if (tickets.length < 1 || tickets.length > 500)
    throw new Error("Import between 1 and 500 tickets at a time.");
  tickets.forEach((ticket, index) => {
    const limits = { externalId: [1, 100], subject: [3, 150], body: [5, 2000] };
    if (
      !ticket ||
      typeof ticket !== "object" ||
      Object.keys(ticket).some((key) => !Object.hasOwn(limits, key))
    )
      throw new Error(
        `Ticket ${index + 1} must contain only externalId, subject, and body.`,
      );
    for (const [field, [min, max]] of Object.entries(limits)) {
      const length =
        typeof ticket[field] === "string" ? ticket[field].trim().length : 0;
      if (length < min || length > max)
        throw new Error(
          `Ticket ${index + 1}: ${field} must contain ${min}–${max} characters.`,
        );
    }
  });
  return tickets;
}
export function validateBooking(
  { startTime, endTime },
  slots = [],
  now = new Date(),
) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()))
    return "Choose a valid start and end time.";
  if (end <= start) return "Choose an end time after the start time.";
  if (
    [start, end].some(
      (date) =>
        date.getUTCSeconds() !== 0 ||
        date.getUTCMilliseconds() !== 0 ||
        date.getUTCMinutes() % 30 !== 0,
    )
  )
    return "Booking times must be on 30-minute boundaries.";
  const duration = (end - start) / 60000;
  if (duration < 30 || duration > 240)
    return "Booking duration must be between 30 minutes and 4 hours.";
  if (start <= now) return "Booking must start in the future.";
  if (start - now > 30 * 86400000)
    return "Bookings cannot start more than 30 days in advance.";
  if (
    slots.some((slot) => {
      const reserved =
        ["PENDING", "APPROVED", "BOOKED"].includes(
          String(slot.status || "").toUpperCase(),
        ) || slot.isAvailable === false;
      return (
        reserved &&
        new Date(slot.startTime || slot.start) < end &&
        new Date(slot.endTime || slot.end) > start
      );
    })
  )
    return "This time overlaps an existing reservation. Choose another time.";
  return "";
}
