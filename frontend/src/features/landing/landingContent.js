import {
  Ticket,
  CalendarCheck,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";
export const features = [
  {
    icon: Ticket,
    title: "Intelligent ticket management",
    description:
      "Organize support requests, classify issues, prioritize work, and follow every ticket through its lifecycle.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: CalendarCheck,
    title: "Conflict-free scheduling",
    description:
      "Discover available rooms, labs, and equipment. Manage reservations with clear booking statuses.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Actionable analytics",
    description:
      "Understand ticket trends, booking activity, and resource utilization through a unified overview.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure role-based access",
    description:
      "Keep user and administrator workflows organized with authentication and permission controls.",
    color: "bg-amber-50 text-amber-600",
  },
];

export const workflow = [
  "Collect and organize incoming support tickets",
  "Classify and prioritize issues",
  "Find and reserve shared resources",
  "Monitor progress from one workspace",
];
