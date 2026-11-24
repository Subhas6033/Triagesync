import api from "../../lib/axios";

export const getDashboardStats = async () => (await api.get("/admin/stats")).data;
export const getTicketDashboardStats = async () => (await api.get("/stats")).data;
