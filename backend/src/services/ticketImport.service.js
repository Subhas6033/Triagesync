import {
  createTicket,
  findTicketByExternalId,
  saveTicket,
} from "../repositories/mongodb/ticket.repository.js";

import { classifyTicket } from "./classifier.service.js";

const updateExistingTicket = async (ticket, input) => {
  const prediction = classifyTicket(input.subject, input.body);

  // Always refresh the imported source text.
  ticket.subject = input.subject;
  ticket.body = input.body;

  // Preserve manual decisions. autoCategory is never modified here.
  if (!ticket.isHumanOverride) {
    ticket.category = prediction.category;
    ticket.priority = prediction.priority;
  }

  await saveTicket(ticket);

  return ticket;
};

export const importTickets = async (tickets) => {
  const result = {
    total: tickets.length,
    importedCount: 0,
    updatedCount: 0,
    skippedOverrideCount: 0,
  };

  for (const input of tickets) {
    let ticket = await findTicketByExternalId(input.externalId);

    if (ticket) {
      const hadHumanOverride = ticket.isHumanOverride === true;
      await updateExistingTicket(ticket, input);
      result.updatedCount += 1;
      if (hadHumanOverride) result.skippedOverrideCount += 1;
      continue;
    }

    const prediction = classifyTicket(input.subject, input.body);

    try {
      await createTicket({
        externalId: input.externalId,
        subject: input.subject,
        body: input.body,
        autoCategory: prediction.category,
        category: prediction.category,
        priority: prediction.priority,
        isHumanOverride: false,
        isReviewed: false,
      });
      result.importedCount += 1;
    } catch (error) {
      // A concurrent import may win the unique externalId insert.
      if (error.code !== 11000) throw error;
      ticket = await findTicketByExternalId(input.externalId);
      if (!ticket) throw error;

      const hadHumanOverride = ticket.isHumanOverride === true;
      await updateExistingTicket(ticket, input);
      result.updatedCount += 1;
      if (hadHumanOverride) result.skippedOverrideCount += 1;
    }
  }

  return result;
};
