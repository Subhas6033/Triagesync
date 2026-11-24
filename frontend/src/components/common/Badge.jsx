import { STATUS_TONES } from "../../utils/constants";
import { formatLabel } from "../../utils/formatters";
import {
  BOOKING_STATUS_STYLES,
  CATEGORY_STYLES,
  PRIORITY_STYLES,
  TICKET_STATUS_STYLES,
} from "../../utils/styleMaps";

const styles = {
  ...CATEGORY_STYLES,
  ...PRIORITY_STYLES,
  ...TICKET_STATUS_STYLES,
  ...BOOKING_STATUS_STYLES,
};

export default function Badge({ value, tone, children, icon = false }) {
  const item = styles[value];
  const Icon = icon ? item?.icon : null;
  return (
    <span className={`status-badge ${tone || item?.tone || STATUS_TONES[value] || "gray"} ${item?.pulse ? "badge-pulse" : ""}`}>
      {Icon && <Icon size={13} aria-hidden="true" />}
      {children ?? item?.label ?? formatLabel(value)}
    </span>
  );
}
