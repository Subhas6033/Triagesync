import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  ChartNoAxesCombined,
  CheckCircle2,
  Headset,
  Layers3,
  Menu,
  ShieldCheck,
  Ticket,
  X,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Ticket,
    title: 'Intelligent ticket management',
    description:
      'Organize support requests, classify issues, prioritize work, and follow every ticket through its lifecycle.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: CalendarCheck,
    title: 'Conflict-free scheduling',
    description:
      'Discover available rooms, labs, and equipment. Manage reservations with clear booking statuses.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Actionable analytics',
    description:
      'Understand ticket trends, booking activity, and resource utilization through a unified overview.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: ShieldCheck,
    title: 'Secure role-based access',
    description:
      'Keep user and administrator workflows organized with authentication and permission controls.',
    color: 'bg-amber-50 text-amber-600',
  },
]

const workflow = [
  'Collect and organize incoming support tickets',
  'Classify and prioritize issues',
  'Find and reserve shared resources',
  'Monitor progress from one workspace',
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <nav className="container-app flex h-[76px] items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="TriageSync home">
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
              Get started <ArrowRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
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
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary">
                Get started <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-indigo-50/70 via-white to-white">
          <div className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 top-64 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl" />

          <div className="container-app relative grid items-center gap-16 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
                <Zap size={15} className="fill-indigo-500" />
                One workspace. Better operations.
              </div>

              <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[68px]">
                Bring your support operations
                <span className="mt-2 block text-indigo-600">
                  into sync.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Simplify ticket triage, coordinate shared resources, and
                manage bookings from one organized workspace built for
                smoother support operations.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">
                  Start for free <ArrowRight size={17} />
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
              <div className="absolute -inset-5 rounded-[32px] bg-indigo-100/70 blur-2xl" />

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
                        <p className="text-sm font-medium text-slate-700">
                          {item}
                        </p>
                        <CheckCircle2 size={17} className="ml-auto shrink-0 text-emerald-500" />
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

        {/* Features */}
        <section id="features" className="border-t border-slate-100 bg-slate-50/70 py-24">
          <div className="container-app">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Everything in one place
              </span>
              <h2 className="section-heading mt-4">
                Tools that work better together.
              </h2>
              <p className="muted-text mt-5">
                Bring ticket management, resource scheduling, and
                operational insights into one connected platform.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <article
                    key={feature.title}
                    className="surface card-hover p-6"
                  >
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                      <Icon size={23} />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Workflow */}
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
                Keep the important parts of support operations connected.
                Triage requests, coordinate shared resources, and track
                activity without jumping between disconnected workflows.
              </p>
            </div>

            <div className="space-y-4">
              {workflow.map((item, index) => (
                <div key={item} className="surface flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-slate-800">{item}</p>
                  <CheckCircle2 className="ml-auto shrink-0 text-emerald-500" size={20} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="about" className="bg-slate-50 py-20">
          <div className="container-app">
            <div className="overflow-hidden rounded-3xl bg-indigo-600 px-7 py-16 text-center shadow-xl shadow-indigo-600/15 sm:px-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Headset size={27} />
              </div>
              <h2 className="mt-7 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to bring everything into sync?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-indigo-100">
                Start organizing support tickets and resource bookings
                with one connected workspace.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                Create your account <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-500 sm:flex-row">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-800">
            <Layers3 size={19} className="text-indigo-600" />
            TriageSync
          </Link>
          <p>© {new Date().getFullYear()} TriageSync. All rights reserved.</p>
          <p>Support smarter. Schedule better.</p>
        </div>
      </footer>
    </div>
  )
}
