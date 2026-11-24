import Pagination from "../components/common/Pagination";
import { useRef, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ResourceForm from "../features/resources/components/ResourceForm";
import ResourceList from "../features/resources/components/ResourceList";
import {
  useResources,
  useResourceMutations,
} from "../features/resources/hooks/useResources";
export default function AdminResourcesPage() {
  const [page, setPage] = useState(1);
  const query = useResources({ page });
  if (query.isSuccess && page > query.pages) setPage(query.pages);
  const { toggle } = useResourceMutations();
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const formAnchor = useRef(null);
  function edit(resource) {
    setEditing(resource);
    formAnchor.current.scrollIntoView({ behavior: "smooth", block: "start" });
    formAnchor.current.focus();
  }
  async function confirmToggle() {
    try {
      await toggle.mutateAsync(selected);
      setSelected(null);
    } catch {
      /* Show mutation error in dialog. */
    }
  }
  return (
    <main className="workspace-page">
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Manage resources"
        description="Create resources and keep availability information current."
      />
      <div ref={formAnchor} tabIndex={-1}>
        <ResourceForm
          key={editing?.id ?? "new"}
          resource={editing}
          onSaved={() => setEditing(null)}
          onCancel={() => setEditing(null)}
        />
      </div>
      <div className="section-title">
        <h2>Workspace resources</h2>
      </div>
      <ResourceList
        query={query}
        resources={query.data || []}
        onEdit={edit}
        onToggle={(resource) => {
          toggle.reset();
          setSelected(resource);
        }}
        busy={toggle.isPending}
      />
      <Pagination
        page={query.page}
        total={query.total}
        pageSize={query.pageSize}
        onChange={setPage}
      />
      <ConfirmDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={confirmToggle}
        title={
          selected?.isActive === false
            ? "Activate this resource?"
            : "Deactivate this resource?"
        }
        description={
          selected?.isActive === false
            ? "Members will be able to request bookings."
            : "Members will no longer be able to request bookings for this resource."
        }
        confirmLabel={selected?.isActive === false ? "Activate" : "Deactivate"}
        loading={toggle.isPending}
        error={toggle.error}
      />
    </main>
  );
}
