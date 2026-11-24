const queryKeys = {
  tickets: ["tickets"],
  ticketList: ["tickets", "list"],
  ticket: (id) => ["tickets", "detail", String(id)],
  resources: ["resources"],
  resourceList: ["resources", "list"],
  resource: (id) => ["resources", "detail", String(id)],
  availability: (id) => ["resources", "availability", String(id)],
  allAvailability: ["resources", "availability"],
  bookings: ["bookings"],
  adminBookings: ["bookings", "admin"],
  myBookings: ["bookings", "mine"],
  dashboard: ["dashboard"],
  adminStats: ["dashboard", "admin"],
  ticketStats: ["dashboard", "tickets"],
};
export default queryKeys;
