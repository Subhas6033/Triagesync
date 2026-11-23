import mongoose from "mongoose";

const TICKET_CATEGORIES = [
  "BILLING",
  "LOGIN",
  "DELIVERY",
  "BUG",
  "FEATURE_REQUEST",
];

const TICKET_PRIORITIES = ["URGENT", "HIGH", "MEDIUM", "LOW"];

const TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const ticketSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
    },

    autoCategory: {
      type: String,
      enum: TICKET_CATEGORIES,
      required: true,
      immutable: true,
    },

    category: {
      type: String,
      enum: TICKET_CATEGORIES,
      required: true,
    },

    isHumanOverride: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: TICKET_PRIORITIES,
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: TICKET_STATUSES,
      default: "OPEN",
    },

    assigneeId: {
      type: String,
      default: null,
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ticketSchema.index({ status: 1, category: 1, priority: 1 });
ticketSchema.index({ createdAt: -1 });

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
