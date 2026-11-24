import { BOOKING_STATUSES, STATUS_TONES } from "../../utils/constants";
import { chartEntries, formatLabel } from "../../utils/formatters";
export default function StatusChart({ values }) {
  const counts = Object.fromEntries(chartEntries(values));
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  return (
    <>
      <div className="booking-total">
        <strong>{total}</strong>
        <span>total bookings</span>
      </div>
      <ul className="status-bars">
        {BOOKING_STATUSES.map((status) => (
          <li className="status-row" key={status}>
            <span>{formatLabel(status)}</span>
            <div className="bar-track" aria-hidden="true">
              <i
                className={`bar-fill ${STATUS_TONES[status]}`}
                style={{
                  width: `${total ? ((counts[status] || 0) / total) * 100 : 0}%`,
                }}
              />
            </div>
            <b>{counts[status] || 0}</b>
          </li>
        ))}
      </ul>
    </>
  );
}
