import api from "../../lib/axios";
export const getDashboardStats = async () =>
  (await api.get("/admin/stats")).data;
