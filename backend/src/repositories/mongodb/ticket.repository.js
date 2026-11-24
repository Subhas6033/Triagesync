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
      $facet: {
        byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
        byPriority: [{ $group: { _id: "$priority", count: { $sum: 1 } } }],
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        reviewMetrics: [
          {
            $group: {
              _id: null,
              reviewedCount: { $sum: { $cond: ["$isReviewed", 1, 0] } },
              agreementCount: {
                $sum: {
                  $cond: [
                    { $and: ["$isReviewed", { $eq: ["$category", "$autoCategory"] }] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        byCategory: 1,
        byPriority: 1,
        byStatus: 1,
        reviewedCount: { $ifNull: [{ $arrayElemAt: ["$reviewMetrics.reviewedCount", 0] }, 0] },
        agreementCount: { $ifNull: [{ $arrayElemAt: ["$reviewMetrics.agreementCount", 0] }, 0] },
      },
    },
    {
      $project: {
        byCategory: 1,
        byPriority: 1,
        byStatus: 1,
        reviewedCount: 1,
        agreementCount: 1,
        _id: 0,
      },
    },
  ]);
};
