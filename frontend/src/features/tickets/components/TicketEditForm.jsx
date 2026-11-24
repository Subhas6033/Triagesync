import { useTicketMutations } from "../hooks/useTickets";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import ErrorState from "../../../components/common/ErrorState";
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
} from "../../../utils/constants";
import { formatLabel } from "../../../utils/formatters";
import { useState } from "react";
export default function TicketEditForm({ ticket }) {
  const { update } = useTicketMutations();
  const [errorDismissed, setErrorDismissed] = useState(false);
  function submit(event) {
    event.preventDefault();
    setErrorDismissed(false);
    const fields = [...new FormData(event.currentTarget)].filter(
      ([, value]) => value,
    );
    update.mutate({ id: ticket.id, ...Object.fromEntries(fields) });
  }
  return (
    <Card
      title="Update ticket"
      description="Changes are recorded in the audit history."
      className={`edit-panel ${update.isError ? "rollback-shake" : ""}`}
    >
      <form className="detail-form" onSubmit={submit}>
        {[
          ["status", "Status", TICKET_STATUSES, "OPEN"],
          ["priority", "Priority", TICKET_PRIORITIES, "MEDIUM"],
          ["category", "Category", TICKET_CATEGORIES, "BILLING"],
        ].map(([name, label, values, fallback]) => (
          <Select
            key={name}
            name={name}
            label={label}
            defaultValue={ticket[name] || fallback}
          >
            {values.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </Select>
        ))}
        <Input
          name="assigneeId"
          label="Assignee ID"
          defaultValue={ticket.assigneeId || ""}
          placeholder="Optional user ID"
        />
        {update.isError && !errorDismissed && (
          <ErrorState
            title="Could not update this ticket"
            error={update.error}
            onDismiss={() => setErrorDismissed(true)}
          />
        )}
        {update.isSuccess && (
          <p className="success-message" role="status">
            Ticket changes saved.
          </p>
        )}
        <Button type="submit" loading={update.isPending} onClick={() => setErrorDismissed(false)}>
          {update.isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
