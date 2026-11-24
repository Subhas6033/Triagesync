const queryKeys = {
  tickets: ["tickets"],
  ticket: (id) => ["tickets", id],
  resources: ["resources"],
  resource: (id) => ["resources", id],
  bookings: ["bookings"],
  myBookings: ["bookings", "mine"],
  dashboard: ["dashboard"],
};

export default queryKeys;
