export default function Card({
  title,
  description,
  action,
  children,
  className = "",
  ...props
}) {
  return (
    <section {...props} className={`panel ${className}`}>
      {(title || action) && (
        <div className="panel-heading">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
