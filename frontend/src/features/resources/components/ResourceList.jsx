import { Package } from "lucide-react";
import ResourceCard from "./ResourceCard";
import Skeleton from "../../../components/common/Skeleton";
import EmptyState from "../../../components/common/EmptyState";
import ErrorState from "../../../components/common/ErrorState";
export default function ResourceList({
  resources,
  query,
  onEdit,
  onToggle,
  busy,
}) {
  if (query.isPending)
    return <Skeleton count={3} className="resource-skeleton" />;
  if (query.isError)
    return (
      <ErrorState
        title="Resources could not be loaded"
        error={query.error}
        onRetry={query.refetch}
      />
    );
  if (!resources.length)
    return (
      <EmptyState
        icon={Package}
        title="No resources found"
        description={
          onEdit
            ? "Create your first resource using the form above."
            : "Try another search or resource type. New workspace resources will appear here."
        }
      />
    );
  return (
    <div className="resource-grid">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onEdit={onEdit}
          onToggle={onToggle}
          busy={busy}
        />
      ))}
    </div>
  );
}
