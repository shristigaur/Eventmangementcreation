import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center px-6">
      <section className="w-full max-w-3xl rounded-3xl border border-emerald-100 bg-white/90 backdrop-blur p-8 md:p-14 text-center shadow-2xl shadow-emerald-100">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-700 font-semibold">Eventify</p>
        <h1 className="mt-5 text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          Discover unforgettable events in one place.
        </h1>
        <p className="mt-5 text-slate-600 text-base md:text-lg">
          Start by creating your account, then sign in to explore your personalized event world.
        </p>

        <div className="mt-9 flex items-center justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-white font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition"
          >
            Explore
          </Link>
        </div>
      </section>
    </main>
  );
}
