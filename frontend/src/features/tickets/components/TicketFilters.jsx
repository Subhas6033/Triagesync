import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
} from "../../../utils/constants";
import { formatLabel } from "../../../utils/formatters";
const options = [
  ["status", "Status", "All statuses", TICKET_STATUSES],
  ["priority", "Priority", "All priorities", TICKET_PRIORITIES],
  ["category", "Category", "All categories", TICKET_CATEGORIES],
];
export default function TicketFilters({ filters, onChange }) {
  return (
    <div className="filter-row">
      {options.map(([key, label, all, values]) => (
        <Select
          key={key}
          label={label}
          value={filters[key]}
          onChange={(event) =>
            onChange({ ...filters, [key]: event.target.value })
          }
        >
          <option value="">{all}</option>
          {values.map((value) => (
            <option key={value} value={value}>
              {formatLabel(value)}
            </option>
          ))}
        </Select>
      ))}
      {Object.entries(filters).filter(([, value]) => value).map(([key, value]) => (
        <button type="button" className="filter-chip" key={key} onClick={() => onChange({ ...filters, [key]: "" })}>
          {key}: {formatLabel(value)} <span aria-hidden="true">×</span>
        </button>
      ))}
      {Object.values(filters).some(Boolean) && <Button variant="ghost" size="sm" onClick={() => onChange({ status: "", priority: "", category: "" })}>Clear all</Button>}
    </div>
  );
}
