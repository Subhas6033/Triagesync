import { STATUS_TONES } from "../../utils/constants";
import { formatLabel } from "../../utils/formatters";
export default function Badge({ value, tone, children }) {
  return (
    <span className={`status-badge ${tone || STATUS_TONES[value] || "gray"}`}>
      {children ?? formatLabel(value)}
    </span>
  );
}
