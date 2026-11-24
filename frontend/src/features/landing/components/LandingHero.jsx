import { Link } from "react-router-dom";
import {
  Zap,
  CheckCircle2,
  ChartNoAxesCombined,
  Ticket,
  CalendarCheck,
} from "lucide-react";
import { workflow } from "../landingContent";
export default function LandingHero() {
  return (
    <section className="relative bg-white">
      <div className="container-app relative grid items-center gap-16 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
            <Zap size={15} className="fill-indigo-500" />
            One workspace. Better operations.
          </div>

          <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[68px]">
            Bring your support operations
            <span className="mt-2 block text-indigo-600">into sync.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Simplify ticket triage, coordinate shared resources, and manage
            bookings from one organized workspace built for smoother support
            operations.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">
              Start for free
            </Link>
            <a href="#features" className="btn-secondary">
              Explore features
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-600" />
              Organized workflows
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-600" />
              Role-based access
            </span>
          </div>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="surface relative overflow-hidden p-5 shadow-2xl shadow-slate-900/10 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Workspace
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Overview
                </h2>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <ChartNoAxesCombined size={22} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Ticket size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Ticket management
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Triage and track issues
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                  <CalendarCheck size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Resource booking
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Coordinate availability
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">
                  Your workflow
                </p>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Connected
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {workflow.map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">
                      0{index + 1}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                    <CheckCircle2
                      size={17}
                      className="ml-auto shrink-0 text-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              A unified support operations workspace
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
