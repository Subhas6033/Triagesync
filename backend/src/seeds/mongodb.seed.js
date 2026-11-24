import Ticket from "../models/mongodb/Ticket.model.js";

const records = [
  ["001", "Charged twice for subscription", "My account shows two charges. Please refund one.", "BILLING", "HIGH", "OPEN", true],
  ["002", "Incorrect invoice amount", "The invoice total does not match checkout.", "BILLING", "HIGH", "IN_PROGRESS", true],
  ["003", "Payment failed", "The payment gateway returns an error.", "BILLING", "MEDIUM", "OPEN", false],
  ["004", "Production billing outage", "Production billing is down. Customers cannot pay.", "BILLING", "URGENT", "OPEN", false],
  ["005", "Cannot reset password", "The password reset link is not working.", "LOGIN", "MEDIUM", "OPEN", false],
  ["006", "Locked out of account", "I am locked out and cannot sign in.", "LOGIN", "URGENT", "OPEN", true],
  ["007", "Two factor authentication failing", "My 2FA verification code is rejected.", "LOGIN", "HIGH", "IN_PROGRESS", false],
  ["008", "Sign in page keeps refreshing", "The login page refreshes without signing me in.", "LOGIN", "MEDIUM", "RESOLVED", false],
  ["009", "Package has not arrived", "My package has not arrived after the estimated date.", "DELIVERY", "HIGH", "OPEN", false],
  ["010", "Incorrect shipping address", "The shipping address on my order is incorrect.", "DELIVERY", "MEDIUM", "IN_PROGRESS", false],
  ["011", "Tracking number not updating", "Tracking has shown the same location for days.", "DELIVERY", "MEDIUM", "OPEN", false],
  ["012", "Delivery service error", "Delivery reports an error and shipment has not arrived.", "DELIVERY", "HIGH", "RESOLVED", false],
  ["013", "Application crashes on dashboard", "The application crashes with an exception.", "BUG", "HIGH", "OPEN", false],
  ["014", "Production server error 500", "Production server is down and returns HTTP 500.", "BUG", "URGENT", "IN_PROGRESS", false],
  ["015", "Search results are broken", "Searching for a ticket returns an error.", "BUG", "MEDIUM", "OPEN", false],
  ["016", "HTML rendering security test", "<p>Security test</p><script>alert('XSS')</script><img src=x onerror=alert('XSS')>", "BUG", "HIGH", "OPEN", false],
  ["017", "Please add dark mode", "It would be helpful to have a dark mode option.", "FEATURE_REQUEST", "MEDIUM", "OPEN", false],
  ["018", "Add CSV export", "Please allow administrators to export reports as CSV.", "FEATURE_REQUEST", "MEDIUM", "IN_PROGRESS", false],
  ["019", "Request keyboard shortcuts", "Keyboard shortcuts would make ticket management faster.", "FEATURE_REQUEST", "LOW", "OPEN", false],
  ["020", "Improve dashboard filtering", "Please add more dashboard filtering options.", "FEATURE_REQUEST", "HIGH", "RESOLVED", false],
];

export const seedTickets = async () => {
  let inserted = 0;

  for (const [id, subject, body, category, priority, status, isReviewed] of records) {
    const ticket = {
      externalId: `TS-SEED-${id}`,
      subject,
      body,
      category,
      autoCategory: category,
      isHumanOverride: false,
      priority,
      status,
      isReviewed,
    };

    const result = await Ticket.updateOne(
      { externalId: ticket.externalId },
      { $setOnInsert: ticket },
      { upsert: true },
    );

    inserted += result.upsertedCount;
  }

  console.log(
    `MongoDB ticket seed completed | Inserted: ${inserted} | Total: ${await Ticket.countDocuments()}`,
  );
};
