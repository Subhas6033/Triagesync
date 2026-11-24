import {
  Ticket,
  CalendarCheck,
  ChartNoAxesCombined,
  ShieldCheck,
  UserRoundCheck,
  RefreshCw,
  ScrollText,
  LockKeyhole,
  Workflow,
} from "lucide-react";

export const hero = {
  eyebrow: "SUPPORT OPERATIONS, IN SYNC",
  title: "A clearer path from ticket to resolution.",
  description:
    "Triage incoming requests, protect human decisions, and coordinate shared resources in one focused workspace.",
};

export const features = [
  {
    icon: Workflow,
    title: "Auto-triage",
    description: "Route requests into a consistent starting point for the right team.",
    color: "feature-green",
  },
  {
    icon: UserRoundCheck,
    title: "Human-override protection",
    description: "Agent decisions stay in control when a classification needs a correction.",
    color: "feature-amber",
  },
  {
    icon: ScrollText,
    title: "Immutable audit trail",
    description: "Keep a clear record of ticket changes, actors, and review history.",
    color: "feature-slate",
  },
  {
    icon: RefreshCw,
    title: "Optimistic updates",
    description: "Make routine edits feel immediate while the workspace stays in sync.",
    color: "feature-blue",
  },
  {
    icon: CalendarCheck,
    title: "Race-safe booking",
    description: "Coordinate shared slots with clear availability and booking decisions.",
    color: "feature-orange",
  },
  {
    icon: LockKeyhole,
    title: "Role-based access",
    description: "Give agents and administrators the right tools for their work.",
    color: "feature-violet",
  },
];

export const workflow = [
  "Import the support feed",
  "Start with an automatic triage",
  "Review and refine with an agent",
  "Book the resource that moves work forward",
];

export const faqs = [
  {
    question: "Who is TriageSync designed for?",
    answer: "Support teams that need a shared view of incoming tickets and the rooms, labs, or equipment used to resolve them.",
  },
  {
    question: "Can agents change an automatic category?",
    answer: "Yes. Agents can review a ticket and apply a human decision. The ticket keeps its review state and audit history.",
  },
  {
    question: "How does shared-resource booking work?",
    answer: "Teams can check availability and request a resource in 30-minute increments. Administrators can review pending requests.",
  },
  {
    question: "What can administrators manage?",
    answer: "Administrators can manage resources and booking decisions, and see operational analytics in the workspace dashboard.",
  },
];

export const landingStats = [
  { value: "One", label: "connected workspace" },
  { value: "30 min", label: "booking increments" },
  { value: "Every change", label: "visible in the audit trail" },
];

export const trustFeatures = [Ticket, ChartNoAxesCombined, ShieldCheck];
