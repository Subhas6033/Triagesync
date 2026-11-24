import { CalendarDays, MapPin, Users } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import AvailabilityCalendar from "./AvailabilityCalendar";
import BookingForm from "../../bookings/components/BookingForm";
export default function ResourceDetails({ resource, availability }) {
  return (
    <>
      <PageHeader
        eyebrow={resource.type || "RESOURCE"}
        title={resource.name}
        description={resource.description || "Shared workspace resource."}
      >
        <Badge value={resource.isActive === false ? "INACTIVE" : "ACTIVE"} />
      </PageHeader>
      <div className="resource-detail-grid">
        <Card
          title="Resource information"
          description="Plan your team’s next session with this shared resource."
          className="resource-overview"
        >
          <div className="resource-detail-meta">
            {resource.location && (
              <span>
                <MapPin size={18} />
                <span>
                  <small>Location</small>
                  <b>{resource.location}</b>
                </span>
              </span>
            )}
            {resource.capacity && (
              <span>
                <Users size={18} />
                <span>
                  <small>Capacity</small>
                  <b>{resource.capacity} people</b>
                </span>
              </span>
            )}
            <span>
              <CalendarDays size={18} />
              <span>
                <small>Availability window</small>
                <b>Next 7 days</b>
              </span>
            </span>
          </div>
          <AvailabilityCalendar query={availability} />
        </Card>
        <BookingForm resource={resource} slots={availability.data || []} availabilityPending={availability.isPending} />
      </div>
    </>
  );
}
