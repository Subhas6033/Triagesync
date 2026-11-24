import { Link } from "react-router-dom";
import { Layers3 } from "lucide-react";
export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-app flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-500 sm:flex-row">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-slate-800"
        >
          <Layers3 size={19} className="text-indigo-600" />
          TriageSync
        </Link>
        <p>© {new Date().getFullYear()} TriageSync. All rights reserved.</p>
        <p>Support smarter. Schedule better.</p>
      </div>
    </footer>
  );
}
