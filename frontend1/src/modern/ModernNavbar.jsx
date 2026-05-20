import { Link } from "react-router-dom";

export default function ModernNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/modern" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-200">E</div>
          <div className="text-lg font-semibold text-slate-900">Eventify</div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <Link to="/modern" className="hover:text-slate-900">Home</Link>
          <Link to="#" className="hover:text-slate-900">Business</Link>
          <Link to="#" className="hover:text-slate-900">Travel</Link>
          <Link to="#" className="hover:text-slate-900">Festivals</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm px-4 py-2 text-emerald-600 font-medium hover:text-emerald-700">Sign in</Link>
          <Link to="/signup" className="text-sm px-5 py-2 bg-emerald-600 text-white rounded-full shadow-sm hover:bg-emerald-700 transition">Sign up</Link>
        </div>

        <div className="md:hidden">
          <button aria-label="menu" className="p-2 rounded-md bg-slate-100">☰</button>
        </div>
      </div>
    </header>
  );
}
