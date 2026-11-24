import { LoaderCircle } from "lucide-react";
export default function Loader({ label = "Loading…", inline = false }) {
  return (
    <span className={`loader ${inline ? "loader-inline" : ""}`} role="status">
      <LoaderCircle size={18} aria-hidden="true" />
      <span className={inline ? "sr-only" : ""}>{label}</span>
    </span>
  );
}
