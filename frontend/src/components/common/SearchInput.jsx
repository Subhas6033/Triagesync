import { Search } from "lucide-react";
export default function SearchInput({
  label,
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
}) {
  const Wrapper = onSubmit ? "form" : "div";
  return (
    <Wrapper
      className="ticket-search"
      {...(onSubmit
        ? {
            onSubmit: (event) => {
              event.preventDefault();
              onSubmit();
            },
            role: "search",
          }
        : {})}
    >
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {onSubmit && <button type="submit">Search</button>}
    </Wrapper>
  );
}
