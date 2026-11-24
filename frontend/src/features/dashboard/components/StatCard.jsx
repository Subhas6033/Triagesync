import AnimatedNumber from "../../../components/common/AnimatedNumber";
export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "violet",
  note,
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={21} aria-hidden="true" />
      </div>
      <p>{label}</p>
      <strong>{typeof value === "number" ? <AnimatedNumber value={value} /> : value ?? "—"}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}
