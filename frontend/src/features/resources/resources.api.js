import api from "../../lib/axios";

export const getResources = async (params = {}) => (await api.get("/resources", { params })).data;
export const getResource = async (id) => (await api.get(`/resources/${id}`)).data;
export const getResourceAvailability = async (id, from, to) =>
  (await api.get(`/resources/${id}/availability`, { params: { from, to } })).data;
export const createResource = async (resource) => (await api.post("/resources", resource)).data;
export const updateResource = async ({ id, ...resource }) => (await api.patch(`/resources/${id}`, resource)).data;
