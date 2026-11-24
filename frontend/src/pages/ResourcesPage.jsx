import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, MapPin, Users, ArrowUpRight, Package, SlidersHorizontal } from "lucide-react";
import { getResources } from "../features/resources/resources.api";
import queryKeys from "../lib/queryKeys";

const EMPTY_RESOURCES = [];
export default function ResourcesPage() {
  const [q, setQ] = useState(""); const [type, setType] = useState("");
  const query = useQuery({ queryKey: queryKeys.resources, queryFn: () => getResources() });
  const response = query.data; const items = Array.isArray(response) ? response : response?.data ?? response?.resources ?? EMPTY_RESOURCES;
  const types = [...new Set(items.map(x => x.type).filter(Boolean))]; const filtered = useMemo(() => items.filter(x => (!type || x.type === type) && `${x.name} ${x.location} ${x.description}`.toLowerCase().includes(q.toLowerCase())), [items, type, q]);
  return <main className="workspace-page"><div className="page-heading"><div><p className="eyebrow">SHARED WORKSPACE</p><h1>Resources</h1><p className="page-subtitle">Find a space or piece of equipment for your team.</p></div></div>
    <section className="panel resource-controls"><div className="ticket-search"><Search size={16}/><input aria-label="Search resources" placeholder="Search by name, location..." value={q} onChange={e=>setQ(e.target.value)}/></div><label className="resource-filter"><SlidersHorizontal size={15}/><select aria-label="Filter by resource type" value={type} onChange={e=>setType(e.target.value)}><option value="">All resource types</option>{types.map(t=><option key={t}>{t}</option>)}</select></label><span className="result-count">{filtered.length} available</span></section>
    {query.isError && <div className="inline-alert" role="alert">{query.error?.response?.data?.message || "Unable to load resources."}<button aria-label="Retry loading resources" onClick={()=>query.refetch()}>Retry</button></div>}
    {query.isPending ? <div className="resource-grid">{[1,2,3].map(i=><div className="skeleton resource-skeleton" key={i}/>)}</div> : <div className="resource-grid">{filtered.map(item=><Link key={item.id} to={`/resources/${item.id}`} className="resource-card"><div className="resource-card-head"><span className="resource-icon"><Package size={21}/></span><span className={`resource-active ${item.isActive === false ? "inactive" : ""}`}><i/>{item.isActive === false ? "Inactive" : "Available"}</span></div><div className="resource-type">{item.type || "RESOURCE"}</div><h2>{item.name}</h2><p className="resource-description">{item.description || "Shared resource available for booking."}</p><div className="resource-meta">{item.location && <span><MapPin size={15}/>{item.location}</span>}{item.capacity && <span><Users size={15}/>Capacity {item.capacity}</span>}</div><div className="resource-card-footer"><span>View availability</span><ArrowUpRight size={17}/></div></Link>)}</div>}
    {!query.isPending && !query.isError && filtered.length === 0 && <div className="panel empty-state"><span><Package size={22}/></span><b>{items.length ? "No matching resources" : "No resources available"}</b><p>{items.length ? "Try another search or resource type." : "Resources added to your workspace will appear here."}</p></div>}
  </main>;
}
