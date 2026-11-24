export default function EmptyState({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <div className="empty-state">
      {Icon && (
        <span>
          <Icon size={24} aria-hidden="true" />
        </span>
      )}
      <b>{title}</b>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
