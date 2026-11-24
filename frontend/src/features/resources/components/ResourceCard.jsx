import { Link } from "react-router-dom";
import { MapPin, Package, Users } from "lucide-react";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
export default function ResourceCard({
  resource,
  onEdit,
  onToggle,
  busy = false,
}) {
  const admin = Boolean(onEdit);
  return (
    <article className="resource-card">
      <div className="resource-card-head">
        <span className="resource-icon">
          <Package size={21} />
        </span>
        <Badge value={resource.isActive === false ? "INACTIVE" : "ACTIVE"} />
      </div>
      <div className="resource-type">{resource.type || "RESOURCE"}</div>
      <h2>
        <Link to={`/resources/${resource.id}`}>{resource.name}</Link>
      </h2>
      <p className="resource-description">
        {resource.description || "No description provided."}
      </p>
      <div className="resource-meta">
        {resource.location && (
          <span>
            <MapPin size={16} />
            {resource.location}
          </span>
        )}
        {resource.capacity && (
          <span>
            <Users size={16} />
            Capacity {resource.capacity}
          </span>
        )}
      </div>
      {admin ? (
        <div className="admin-resource-actions">
          <Button variant="ghost" size="sm" onClick={() => onEdit(resource)}>
            Edit details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => onToggle(resource)}
          >
            {resource.isActive === false ? "Activate" : "Deactivate"}
          </Button>
        </div>
      ) : (
        <Link className="resource-card-footer" to={`/resources/${resource.id}`}>
          View availability<span className="sr-only"> for {resource.name}</span>
        </Link>
      )}
    </article>
  );
}
