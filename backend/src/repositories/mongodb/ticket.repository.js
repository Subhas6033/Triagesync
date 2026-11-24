import Ticket from "../../models/mongodb/Ticket.model.js";

export const createTicket = (data) => {
  return Ticket.create(data);
};

export const findTicketByExternalId = (externalId) => {
  return Ticket.findOne({ externalId });
};

export const findTicketById = (id, options = {}) => {
  const query = Ticket.findById(id);

  if (options.session) {
    query.session(options.session);
  }

  return query;
};

export const saveTicket = (ticket, options = {}) => {
  return ticket.save(options);
};

export const findTickets = (filter, skip, limit) => {
  return Ticket.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countTickets = (filter) => {
  return Ticket.countDocuments(filter);
};

export const getTicketStats = () => {
  return Ticket.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        open: {
          $sum: { $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0] },
        },
        inProgress: {
          $sum: {
            $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0],
          },
        },
        resolved: {
          $sum: { $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0] },
        },
        urgent: {
          $sum: { $cond: [{ $eq: ["$priority", "URGENT"] }, 1, 0] },
        },
        reviewed: {
          $sum: { $cond: ["$isReviewed", 1, 0] },
        },
        modelAgreement: {
          $sum: {
            $cond: [{ $eq: ["$category", "$autoCategory"] }, 1, 0],
          },
        },
      },
    },
  ]);
};
