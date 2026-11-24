import Card from "../../../components/common/Card";
import StatusChart from "../../../components/charts/StatusChart";
import BreakdownChart from "../../../components/charts/BreakdownChart";
export default function ResourceOverview({ data, admin }) {
  return (
    <div className="dashboard-grid">
      <Card
        title={admin ? "Booking overview" : "My booking overview"}
        description={
          admin
            ? "Reservation status across your workspace"
            : "Status of your resource reservations"
        }
      >
        {data.bookingsTotal == null ? (
          <p className="analytics-empty">Booking data is unavailable.</p>
        ) : (
          <StatusChart values={data.bookingCounts} />
        )}
      </Card>
      {admin && (
        <BreakdownChart
          title="Top resource utilization"
          description="Reservations by resource"
          values={data.topResources}
        />
      )}
    </div>
  );
}
