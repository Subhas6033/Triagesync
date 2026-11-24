import { useState } from "react";
import { Link } from "react-router-dom";
import { Layers3, Menu, X } from "lucide-react";
export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <nav className="container-app flex h-[76px] items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="TriageSync home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <Layers3 size={21} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Triage<span className="text-indigo-600">Sync</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-indigo-600">
              How it works
            </a>
            <a href="#about" className="transition hover:text-indigo-600">
              About
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get started
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4 text-sm font-medium text-slate-700">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>
                How it works
              </a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>
                About
              </a>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
