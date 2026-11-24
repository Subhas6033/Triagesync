import { Ticket } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import SearchInput from "../components/common/SearchInput";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";
import Pagination from "../components/common/Pagination";
import TicketImport from "../features/tickets/components/TicketImport";
import TicketFilters from "../features/tickets/components/TicketFilters";
import TicketTable from "../features/tickets/components/TicketTable";
import { useTicketList } from "../features/tickets/hooks/useTickets";
import { PAGE_SIZE } from "../utils/constants";
import useTicketStats from "../features/tickets/hooks/useTicketStats";
import { chartEntries } from "../utils/formatters";
import { TICKET_STATUSES } from "../utils/constants";
export default function TicketsPage() {
  const {
    query,
    search,
    setSearch,
    submitSearch,
    filters,
    changeFilters,
    setPage,
    pagination,
  } = useTicketList();
  const stats = useTicketStats();
  const statuses = Object.fromEntries(chartEntries(stats.stats.byStatus));
  return (
    <main className="workspace-page">
      <PageHeader
        eyebrow="SUPPORT OPERATIONS"
        title="Tickets"
        description="Triage incoming requests and keep work moving."
      >
        <TicketImport />
      </PageHeader>
      <section className="ticket-stats-strip" aria-label="Ticket triage statistics">
        <div><strong>{stats.stats.reviewedCount ?? "—"}</strong><span>Reviewed</span></div>
        <div className="ticket-agreement"><strong>{stats.stats.modelAgreementRate == null ? "—" : `${stats.stats.modelAgreementRate}%`}</strong><span>Model agreement</span></div>
        {TICKET_STATUSES.map((status) => <div key={status}><strong>{statuses[status] ?? "—"}</strong><span>{status.replaceAll("_", " ")}</span></div>)}
      </section>
      {stats.isError && <ErrorState title="Ticket statistics could not be loaded" error={stats.error} onRetry={stats.refetch} />}
      {stats.isSuccess && <div className="ticket-stat-groups">
        <div><b>By category</b>{chartEntries(stats.categories).map(([label, count]) => <span key={label}>{label.replaceAll("_", " ")} <strong>{count}</strong></span>)}</div>
        <div><b>By priority</b>{chartEntries(stats.priorities).map(([label, count]) => <span key={label}>{label} <strong>{count}</strong></span>)}</div>
      </div>}
      <section className="panel ticket-panel">
        <div className="ticket-toolbar">
          <SearchInput
            label="Search tickets"
            value={search}
            onChange={setSearch}
            onSubmit={submitSearch}
            placeholder="Search tickets…"
          />
          <span className="result-count">{pagination.total} tickets</span>
        </div>
        <TicketFilters filters={filters} onChange={changeFilters} />
        {query.isPending ? (
          <Skeleton count={3} />
        ) : query.isError ? (
          <ErrorState
            title="Tickets could not be loaded"
            error={query.error}
            onRetry={query.refetch}
          />
        ) : pagination.total ? (
          <TicketTable tickets={pagination.items} />
        ) : (
          <EmptyState
            icon={Ticket}
            title="No tickets found"
            description="New support requests will appear here. Try another search or clear your filters."
          />
        )}
        <Pagination
          page={pagination.page}
          total={pagination.total}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      </section>
    </main>
  );
}
