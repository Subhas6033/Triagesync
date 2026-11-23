import {
  createTicket,
  findTicketByExternalId,
  saveTicket,
} from "../repositories/mongodb/ticket.repository.js";

import { classifyTicket } from "./classifier.service.js";

// Update an existing ticket without losing a human category override.
const updateExistingTicket = async (ticket, input) => {
  const prediction = classifyTicket(input.subject, input.body);

  // Always keep imported subject and body up to date.
  ticket.subject = input.subject;
  ticket.body = input.body;

  // Reclassify only when an agent has not overridden the category.
  if (!ticket.isHumanOverride) {
    ticket.category = prediction.category;
    ticket.priority = prediction.priority;
  }

  await saveTicket(ticket);

  return ticket;
};

export const importTickets = async (tickets) => {
  const results = {
    total: tickets.length,
    created: 0,
    updated: 0,
    failed: 0,
    tickets: [],
  };

  for (const input of tickets) {
    try {
      let ticket = await findTicketByExternalId(input.externalId);

      if (ticket) {
        ticket = await updateExistingTicket(ticket, input);
        results.updated += 1;
      } else {
        const prediction = classifyTicket(input.subject, input.body);

        try {
          ticket = await createTicket({
            externalId: input.externalId,
            subject: input.subject,
            body: input.body,
            autoCategory: prediction.category,
            category: prediction.category,
            priority: prediction.priority,
            isHumanOverride: false,
          });

          results.created += 1;
        } catch (error) {
          // Another simultaneous import may have created this externalId.
          if (error.code !== 11000) {
            throw error;
          }

          ticket = await findTicketByExternalId(input.externalId);

          if (!ticket) {
            throw error;
          }

          ticket = await updateExistingTicket(ticket, input);
          results.updated += 1;
        }
      }

      results.tickets.push({
        id: ticket._id,
        externalId: ticket.externalId,
        subject: ticket.subject,
        autoCategory: ticket.autoCategory,
        category: ticket.category,
        priority: ticket.priority,
        isHumanOverride: ticket.isHumanOverride,
      });
    } catch (error) {
      results.failed += 1;
      results.tickets.push({
        externalId: input.externalId,
        error: error.message,
      });
    }
  }

  return results;
};
