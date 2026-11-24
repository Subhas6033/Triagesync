import { CheckCircle2 } from "lucide-react";
import { workflow } from "../landingContent";
export default function LandingWorkflow() {
  return (
    <section id="workflow" className="bg-white py-24">
      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            A simpler process
          </span>
          <h2 className="section-heading mt-4">
            From incoming request to organized resolution.
          </h2>
          <p className="muted-text mt-5 max-w-xl">
            Keep the important parts of support operations connected. Triage
            requests, coordinate shared resources, and track activity without
            jumping between disconnected workflows.
          </p>
        </div>

        <div className="space-y-4">
          {workflow.map((item, index) => (
            <div key={item} className="surface flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
                {index + 1}
              </div>
              <p className="font-semibold text-slate-800">{item}</p>
              <CheckCircle2
                className="ml-auto shrink-0 text-emerald-500"
                size={20}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
