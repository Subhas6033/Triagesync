import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bot, CheckCircle2, Clock3, Save } from "lucide-react";
import { getTicket, updateTicket } from "../features/tickets/tickets.api";
import queryKeys from "../lib/queryKeys";

const statuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const categories = ["BILLING", "TECHNICAL", "ACCOUNT", "GENERAL"];
export default function TicketDetailsPage() {
  const { id } = useParams(); const client = useQueryClient(); const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: queryKeys.ticket(id), queryFn: () => getTicket(id) });
  const mutation = useMutation({ mutationFn: updateTicket, onSuccess: async (result) => { setMessage("Ticket changes saved."); client.setQueryData(queryKeys.ticket(id), result); await client.invalidateQueries({ queryKey: queryKeys.tickets }); } });
  const ticket = query.data?.ticket; const events = query.data?.events || [];
  function submit(event) { event.preventDefault(); const form = new FormData(event.currentTarget); mutation.mutate({ id, ...Object.fromEntries([...form].filter(([, value]) => value)) }); }
  const reviewed = Boolean(ticket?.reviewedAt || ticket?.humanReviewed || ticket?.reviewedBy);
  return <main className="workspace-page"><Link to="/tickets" className="back-link"><ArrowLeft size={16}/>All tickets</Link>
    {query.isPending ? <div className="detail-loading"><div className="skeleton detail-skeleton"/><div className="skeleton detail-skeleton"/></div> : query.isError ? <div className="panel empty-state"><b>Ticket could not be loaded</b><p>{query.error?.response?.data?.message || "Please try again."}</p><button onClick={() => query.refetch()}>Retry</button></div> : ticket && <>
      <div className="detail-heading"><div><p className="eyebrow">TICKET · {ticket.id}</p><h1>{ticket.subject || "Untitled ticket"}</h1><p className="page-subtitle">Created {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "date unavailable"}</p></div><span className="review-indicator">{reviewed ? <><CheckCircle2 size={17}/> Human reviewed</> : <><Bot size={17}/> Awaiting human review</>}</span></div>
      <div className="ticket-detail-grid"><section className="panel ticket-body-panel"><div className="detail-section-heading"><h2>Request details</h2><span className={`status-badge ${ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? "green" : "blue"}`}>{(ticket.status || "OPEN").replace("_", " ")}</span></div><div className="ticket-content">{ticket.body || "No description was provided."}</div><div className="ticket-meta-grid"><div><span>Category</span><strong>{ticket.category || "Uncategorized"}</strong></div><div><span>Priority</span><strong>{ticket.priority || "Not set"}</strong></div><div><span>Assignee</span><strong>{ticket.assignee?.name || ticket.assignee?.email || ticket.assigneeId || "Unassigned"}</strong></div></div>{reviewed && <p className="review-meta"><CheckCircle2 size={16}/>{ticket.reviewedAt ? `Reviewed ${new Date(ticket.reviewedAt).toLocaleString()}` : "Human review recorded"}{ticket.reviewer?.name ? ` by ${ticket.reviewer.name}` : ""}</p>}</section>
        <section className="panel edit-panel"><div className="panel-heading"><div><h2>Update ticket</h2><p>Changes are recorded in the audit history.</p></div></div><form className="detail-form" onSubmit={submit}><label>Status<select name="status" defaultValue={ticket.status || "OPEN"}>{statuses.map(x=><option key={x}>{x}</option>)}</select></label><label>Priority<select name="priority" defaultValue={ticket.priority || "MEDIUM"}>{priorities.map(x=><option key={x}>{x}</option>)}</select></label><label>Category<select name="category" defaultValue={ticket.category || "GENERAL"}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label>Assignee ID<input name="assigneeId" defaultValue={ticket.assigneeId || ""} placeholder="Optional user ID"/></label>{message && <p className="success-message" role="status">{message}</p>}{mutation.isError && <p className="inline-alert" role="alert">{mutation.error?.response?.data?.message || "Could not update this ticket."}</p>}<button className="btn-primary" disabled={mutation.isPending}><Save size={16}/>{mutation.isPending ? "Saving…" : "Save changes"}</button></form></section>
      </div>
      <section className="panel timeline-panel"><div className="panel-heading"><div><h2>Ticket history</h2><p>Changes made to this request</p></div><Clock3 size={18} className="panel-heading-icon"/></div>{events.length ? <ol className="audit-timeline">{events.map(event=><li key={event.id}><span className="timeline-dot"/><div><strong>{event.field || "Ticket updated"}</strong><p>{event.oldValue || "—"} <span>→</span> {event.newValue || "—"}</p><small>{event.actor || "Workspace member"}{event.createdAt ? ` · ${new Date(event.createdAt).toLocaleString()}` : ""}</small></div></li>)}</ol> : <p className="timeline-empty">No changes have been recorded yet.</p>}</section>
    </>}
  </main>;
}
