import { Link, useParams } from "react-router-dom";
import {
  useResource,
  useResourceAvailability,
} from "../features/resources/hooks/useResources";
import ResourceDetails from "../features/resources/components/ResourceDetails";
import Skeleton from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
export default function ResourceDetailsPage() {
  const { id } = useParams();
  const query = useResource(id);
  const availability = useResourceAvailability(id, Boolean(query.data));
  return (
    <main className="workspace-page">
      <Link to="/resources" className="back-link">
        All resources
      </Link>
      {query.isPending ? (
        <Skeleton className="detail-skeleton" />
      ) : query.isError ? (
        <ErrorState
          title="Resource could not be loaded"
          error={query.error}
          onRetry={query.refetch}
        />
      ) : query.data ? (
        <ResourceDetails
          key={id}
          resource={query.data}
          availability={availability}
        />
      ) : (
        <EmptyState title="Resource not found" />
      )}
    </main>
  );
}
