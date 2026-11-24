import { Link } from "react-router-dom";
import { Headset } from "lucide-react";
export default function LandingCTA() {
  return (
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
            Start organizing support tickets and resource bookings with one
            connected workspace.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            Create your account
          </Link>
        </div>
      </div>
    </section>
  );
}
