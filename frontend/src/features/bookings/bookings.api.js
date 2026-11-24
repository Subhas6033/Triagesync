import api from "../../lib/axios";

export const getMyBookings = async (params = {}) => (await api.get("/bookings/mine", { params })).data;
export const getBookings = async (params = {}) => (await api.get("/bookings", { params })).data;
export const getBooking = async (id) => (await api.get(`/bookings/${id}`)).data;
export const createBooking = async (booking) => (await api.post("/bookings", booking)).data;
export const cancelBooking = async (id) => (await api.patch(`/bookings/${id}/cancel`)).data;
export const approveBooking = async (id) => (await api.patch(`/bookings/${id}/approve`)).data;
export const rejectBooking = async ({ id, note }) => (await api.patch(`/bookings/${id}/reject`, { note })).data;
