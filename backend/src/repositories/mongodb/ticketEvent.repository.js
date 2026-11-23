import TicketEvent from "../../models/mongodb/TicketEvent.model.js";

export const createTicketEvents = (events) => {
  if (!events.length) {
    return Promise.resolve([]);
  }

  return TicketEvent.insertMany(events);
};

export const findEventsByTicketId = (ticketId) => {
  return TicketEvent.find({ ticketId }).sort({ createdAt: -1 }).lean();
};
