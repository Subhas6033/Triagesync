import {
  CreditCard,
  KeyRound,
  Truck,
  Bug,
  Lightbulb,
  DoorOpen,
  FlaskConical,
  Wrench,
} from "lucide-react";

export const CATEGORY_STYLES = {
  BILLING: { tone: "category-billing", icon: CreditCard, label: "Billing" },
  LOGIN: { tone: "category-login", icon: KeyRound, label: "Login" },
  DELIVERY: { tone: "category-delivery", icon: Truck, label: "Delivery" },
  BUG: { tone: "category-bug", icon: Bug, label: "Bug" },
  FEATURE_REQUEST: {
    tone: "category-feature",
    icon: Lightbulb,
    label: "Feature request",
  },
};

export const PRIORITY_STYLES = {
  LOW: { tone: "gray", label: "Low" },
  MEDIUM: { tone: "blue", label: "Medium" },
  HIGH: { tone: "amber", label: "High" },
  URGENT: { tone: "red", label: "Urgent", pulse: true },
};

export const TICKET_STATUS_STYLES = {
  OPEN: { tone: "blue", label: "Open" },
  IN_PROGRESS: { tone: "violet", label: "In progress" },
  RESOLVED: { tone: "green", label: "Resolved" },
  CLOSED: { tone: "gray", label: "Closed" },
};

export const BOOKING_STATUS_STYLES = {
  PENDING: { tone: "amber", label: "Pending" },
  APPROVED: { tone: "green", label: "Approved" },
  REJECTED: { tone: "red", label: "Rejected" },
  CANCELLED: { tone: "gray", label: "Cancelled" },
};

export const RESOURCE_TYPE_STYLES = {
  ROOM: { icon: DoorOpen, label: "Room" },
  LAB: { icon: FlaskConical, label: "Lab" },
  EQUIPMENT: { icon: Wrench, label: "Equipment" },
};
