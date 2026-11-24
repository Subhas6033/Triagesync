import Card from "../common/Card";
import { chartEntries, formatLabel } from "../../utils/formatters";
const colors = ["violet", "blue", "green", "amber", "red"];
export default function BreakdownChart({
  title,
  description,
  values,
  empty = "No data is available yet.",
}) {
  const entries = chartEntries(values)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const max = Math.max(1, ...entries.map(([, value]) => value));
  return (
    <Card title={title} description={description} className="breakdown-panel">
      {entries.length ? (
        <ul className="breakdown-list">
          {entries.map(([label, value], index) => (
            <li className="breakdown-row" key={label}>
              <div>
                <span>{formatLabel(label)}</span>
                <b>{value}</b>
              </div>
              <div className="breakdown-track" aria-hidden="true">
                <span
                  className={colors[index % colors.length]}
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="analytics-empty">{empty}</p>
      )}
    </Card>
  );
}
