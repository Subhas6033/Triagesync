const CATEGORY_RULES = [
  {
    category: "BILLING",
    keywords: ["refund", "invoice", "charge", "payment"],
  },
  {
    category: "LOGIN",
    keywords: ["password", "2fa", "sign in", "locked out", "login"],
  },
  {
    category: "DELIVERY",
    keywords: ["package", "arrived", "shipping", "tracking", "delivery"],
  },
  {
    category: "BUG",
    keywords: ["crash", "error", "500", "exception", "broken"],
  },
];

export const classifyCategory = (text = "") => {
  const normalized = text.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.category;
    }
  }

  return "FEATURE_REQUEST";
};

export const classifyPriority = (text = "") => {
  const normalized = text.toLowerCase();

  const isUrgent =
    /\burgent\b/.test(normalized) ||
    /\blocked out\b/.test(normalized) ||
    /\bproduction\b.{0,40}\bdown\b/.test(normalized);

  if (isUrgent) {
    return "URGENT";
  }

  if (
    ["error", "refund", "not arrived"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    return "HIGH";
  }

  return "MEDIUM";
};

export const classifyTicket = (subject, body) => {
  const text = `${subject} ${body}`;

  return {
    category: classifyCategory(text),
    priority: classifyPriority(text),
  };
};
