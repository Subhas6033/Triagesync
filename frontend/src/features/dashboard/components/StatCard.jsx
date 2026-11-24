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
      <strong>{value ?? "—"}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}
