import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MapPin, Clock3, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cancelBooking, getMyBookings } from "../features/bookings/bookings.api";
import queryKeys from "../lib/queryKeys";

const tone = { PENDING: "amber", APPROVED: "green", REJECTED: "red", CANCELLED: "gray" };
export default function MyBookingsPage() {
  const client = useQueryClient(); const [msg, setMsg] = useState(""); const query = useQuery({ queryKey: queryKeys.myBookings, queryFn: () => getMyBookings() });
  const cancelMutation = useMutation({ mutationFn: cancelBooking, onSuccess: async () => { setMsg(""); await client.invalidateQueries({ queryKey: queryKeys.myBookings }); }, onError: e => setMsg(e.response?.data?.message || "Unable to cancel booking") });
  const response = query.data; const data = Array.isArray(response) ? response : response?.data ?? response?.bookings ?? [];
  function cancel(id) { if (window.confirm("Cancel this booking request?")) cancelMutation.mutate(id); }
  return <main className="workspace-page"><div className="page-heading"><div><p className="eyebrow">RESERVATIONS</p><h1>My bookings</h1><p className="page-subtitle">Review and manage your resource reservations.</p></div></div>{(msg || query.isError) && <div className="inline-alert" role="alert">{msg || query.error?.response?.data?.message || "Unable to load bookings."}<button aria-label="Dismiss message" onClick={()=>setMsg("")}><XCircle size={16}/></button></div>}
    {query.isPending ? <div className="booking-list">{[1,2].map(i=><div className="skeleton booking-skeleton" key={i}/>)}</div> : data.length ? <div className="booking-list">{data.map(b=><article className="panel booking-card" key={b.id}><div className="booking-card-main"><span className="booking-resource-icon"><CalendarDays size={19}/></span><div className="booking-card-info"><div className="booking-title-row"><h2>{b.resource?.name || `Resource ${b.resourceId}`}</h2><span className={`status-badge ${tone[b.status] || "gray"}`}>{b.status}</span></div><p>{b.purpose || "No purpose provided"}</p><div className="booking-meta"><span><Clock3 size={15}/>{new Date(b.startTime).toLocaleString()} – {new Date(b.endTime).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}</span>{b.resource?.location && <span><MapPin size={15}/>{b.resource.location}</span>}</div>{b.note && <p className="booking-note">{b.note}</p>}</div></div>{["PENDING","APPROVED"].includes(b.status) && <button className="booking-cancel" disabled={cancelMutation.isPending} onClick={()=>cancel(b.id)}><XCircle size={16}/> Cancel</button>}</article>)}</div> : <div className="panel empty-state"><span><CalendarDays size={22}/></span><b>No bookings yet</b><p>Browse available resources to request your first booking.</p><Link className="btn-primary" to="/resources">Explore resources</Link></div>}
  </main>;
}
