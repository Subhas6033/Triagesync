import {
  BOOKING_STATUS_STYLES,
  CATEGORY_STYLES,
  PRIORITY_STYLES,
  TICKET_STATUS_STYLES,
} from "./styleMaps";

export const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
export const TICKET_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
export const TICKET_CATEGORIES = [
  "BILLING",
  "LOGIN",
  "DELIVERY",
  "BUG",
  "FEATURE_REQUEST",
];
export const RESOURCE_TYPES = ["ROOM", "LAB", "EQUIPMENT"];
export const BOOKING_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];
export const STATUS_TONES = {
  ...Object.fromEntries(
    Object.entries({
      ...CATEGORY_STYLES,
      ...PRIORITY_STYLES,
      ...TICKET_STATUS_STYLES,
      ...BOOKING_STATUS_STYLES,
    }).map(([key, style]) => [key, style.tone]),
  ),
  BOOKED: "amber",
  ACTIVE: "green",
  INACTIVE: "gray",
};
export const SESSION_KEYS = {
  token: "triagesync_token",
  user: "triagesync_user",
};
export const PAGE_SIZE = 8;
