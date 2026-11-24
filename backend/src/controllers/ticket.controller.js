import mongoose from "mongoose";
import { prisma } from "../config/mysql.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  findTicketById,
  findTickets,
  countTickets,
  saveTicket,
  getTicketStats,
} from "../repositories/mongodb/ticket.repository.js";

import {
  createTicketEvents,
  findEventsByTicketId,
} from "../repositories/mongodb/ticketEvent.repository.js";

import { importTickets } from "../services/ticketImport.service.js";

import {
  ticketListQuerySchema,
  updateTicketSchema,
} from "../validators/ticket.validator.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const serializeTicket = (ticket) => {
  if (!ticket) return ticket;
  const value =
    typeof ticket.toObject === "function" ? ticket.toObject() : { ...ticket };
  value.id = String(value._id ?? value.id);
  delete value._id;
  return value;
};

const serializeEvent = (event) => {
  const value = { ...event, id: String(event._id ?? event.id) };
  delete value._id;
  return value;
};

// POST /api/tickets/import
export const importTicketData = asyncHandler(async (req, res) => {
  const result = await importTickets(req.body.tickets);

  res.status(200).json(result);
});

// GET /api/tickets
export const getTickets = asyncHandler(async (req, res) => {
  const parsed = ticketListQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      400,
      "Invalid ticket filters or pagination",
      "VALIDATION_ERROR",
    );
  }

  const { page, pageSize, status, category, priority, q } = parsed.data;

  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  if (q) {
    const search = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ subject: search }, { body: search }];
  }

  const skip = (page - 1) * pageSize;

  const [tickets, total] = await Promise.all([
    findTickets(filter, skip, pageSize),
    countTickets(filter),
  ]);

  res.status(200).json({
    data: tickets.map(serializeTicket),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
});

// GET /api/tickets/:id
export const getTicketById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, "Ticket not found", "NOT_FOUND");
  }

  const ticket = await findTicketById(req.params.id);

  if (!ticket) {
    throw new ApiError(404, "Ticket not found", "NOT_FOUND");
  }

  const events = await findEventsByTicketId(ticket._id);

  res.status(200).json({
    ticket: serializeTicket(ticket),
    events: events.map(serializeEvent),
  });
});

// PATCH /api/tickets/:id
// Ticket changes and their audit events are committed in one MongoDB transaction.
export const updateTicket = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, "Ticket not found", "NOT_FOUND");
  }

  const parsedBody = updateTicketSchema.safeParse(req.body);

  const actor = req.get("X-Agent")?.trim() || req.user.email;
  const session = await mongoose.startSession();

  let updatedTicket;

  try {
    await session.withTransaction(async () => {
      const ticket = await findTicketById(req.params.id, { session });

      if (!ticket) {
        throw new ApiError(404, "Ticket not found", "NOT_FOUND");
      }

      if (!parsedBody.success) {
        throw new ApiError(400, "Request validation failed", "VALIDATION_ERROR");
      }

      req.body = parsedBody.data;

      if (req.body.assigneeId != null) {
        const assignee = await prisma.user.findUnique({
          where: { id: req.body.assigneeId },
          select: { id: true },
        });

        if (!assignee) {
          throw new ApiError(404, "Assignee not found", "NOT_FOUND");
        }
      }

      const changes = [];

      for (const field of ["category", "priority", "status", "assigneeId"]) {
        if (
          Object.prototype.hasOwnProperty.call(req.body, field) &&
          ticket[field] !== req.body[field]
        ) {
          changes.push({
            ticketId: ticket._id,
            field,
            oldValue: ticket[field] ?? null,
            newValue: req.body[field] ?? null,
            actor,
          });

          ticket[field] = req.body[field];
        }
      }

      if (changes.length === 0) {
        updatedTicket = serializeTicket(ticket);
        return;
      }

      const categoryChanged = changes.some(
        (change) => change.field === "category",
      );

      const statusChangedFromOpen = changes.some(
        (change) =>
          change.field === "status" && change.oldValue === "OPEN",
      );

      if (categoryChanged) {
        ticket.isHumanOverride = true;
      }

      if (categoryChanged || statusChangedFromOpen) {
        ticket.isReviewed = true;
      }

      await saveTicket(ticket, { session });
      await createTicketEvents(changes, { session });

      updatedTicket = serializeTicket(ticket);
    });
  } finally {
    await session.endSession();
  }

  const events = await findEventsByTicketId(req.params.id);
  res.status(200).json({
    ticket: updatedTicket,
    events: events.map(serializeEvent),
  });
});

// GET /api/stats
export const getTicketDashboardStats = asyncHandler(async (req, res) => {
  const [result] = await getTicketStats();

  const stats = result || {};
  const reviewedCount = stats.reviewedCount ?? 0;
  const modelAgreementRate = reviewedCount
    ? Number(((stats.agreementCount / reviewedCount) * 100).toFixed(2))
    : 0;

  res.status(200).json({
    byCategory: (stats.byCategory ?? []).map(({ _id, count }) => ({
      category: _id,
      count,
    })),
    byPriority: (stats.byPriority ?? []).map(({ _id, count }) => ({
      priority: _id,
      count,
    })),
    byStatus: (stats.byStatus ?? []).map(({ _id, count }) => ({
      status: _id,
      count,
    })),
    reviewedCount,
    modelAgreementRate,
  });
});
