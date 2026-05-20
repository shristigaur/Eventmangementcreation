import { useState } from "react";
import { Link } from "react-router-dom";

export default function ModernNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-200">E</div>
          <div className="text-lg font-semibold text-slate-900">Eventify</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-700">
          <Link to="/" className="hover:text-emerald-600 transition font-medium">Home</Link>
          <Link to="/my-events" className="hover:text-emerald-600 transition font-medium">My Events</Link>
          <div className="flex gap-4">
            <Link to="#business" className="hover:text-emerald-600 transition">Business</Link>
            <Link to="#travel" className="hover:text-emerald-600 transition">Travel</Link>
            <Link to="#festivals" className="hover:text-emerald-600 transition">Festivals</Link>
          </div>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/create-event" className="text-sm px-5 py-2.5 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition font-medium shadow-sm">
            + Create Event
          </Link>
          <Link to="/login" className="text-sm px-4 py-2 text-emerald-600 font-medium hover:text-emerald-700 transition">Sign in</Link>
          <Link to="/signup" className="text-sm px-5 py-2.5 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 transition font-medium">Sign up</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="toggle menu" 
          className="md:hidden p-2 rounded-md hover:bg-slate-100 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link to="/" className="py-2 text-slate-700 hover:text-emerald-600 font-medium">Home</Link>
            <Link to="/my-events" className="py-2 text-slate-700 hover:text-emerald-600 font-medium">My Events</Link>
            <Link to="/create-event" className="py-2 px-4 bg-emerald-100 text-emerald-700 rounded-lg text-center font-medium">+ Create Event</Link>
            <Link to="/login" className="py-2 text-slate-700 hover:text-emerald-600 font-medium">Sign in</Link>
            <Link to="/signup" className="py-2 px-4 bg-emerald-600 text-white rounded-lg text-center font-medium">Sign up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
