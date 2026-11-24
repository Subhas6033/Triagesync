export default function Skeleton({
  count = 1,
  className = "line-skeleton",
  label = "Loading content",
}) {
  return (
    <div className="skeleton-group" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`skeleton ${className}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
