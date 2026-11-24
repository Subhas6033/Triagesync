import { features } from "../landingContent";
export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="border-t border-slate-100 bg-slate-50/70 py-24"
    >
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Everything in one place
          </span>
          <h2 className="section-heading mt-4">
            Tools that work better together.
          </h2>
          <p className="muted-text mt-5">
            Bring ticket management, resource scheduling, and operational
            insights into one connected platform.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="surface card-hover p-6">
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <Icon size={23} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
