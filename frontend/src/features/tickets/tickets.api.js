import api from "../../lib/axios";

export const getTickets = async (params = {}) =>
  (await api.get("/tickets", { params })).data;
export const getTicket = async (id) => (await api.get(`/tickets/${id}`)).data;
export const updateTicket = async ({ id, ...changes }) =>
  (await api.patch(`/tickets/${id}`, changes)).data;
export const importTickets = async (tickets) =>
  (await api.post("/tickets/import", { tickets })).data;
export const getTicketStats = async () => (await api.get("/stats")).data;
