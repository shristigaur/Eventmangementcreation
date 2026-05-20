import { Link } from "react-router-dom";

export default function ModernFooter() {
  return (
    <footer className="border-t border-emerald-100 bg-[#eef9f1] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Eventify</h3>
            <p className="mt-2 text-sm text-slate-700">
              Plan, discover, and enjoy events with a cleaner and more creative experience.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#facebook" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Facebook</a>
              <a href="#twitter" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Twitter</a>
              <a href="#instagram" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Instagram</a>
            </div>
          </div>
          
          {/* Discover */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-900">Discover</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/" className="text-sm text-slate-700 hover:text-emerald-600 transition">Home</Link>
              <a href="#business" className="text-sm text-slate-700 hover:text-emerald-600 transition">Business</a>
              <a href="#festivals" className="text-sm text-slate-700 hover:text-emerald-600 transition">Festivals</a>
              <a href="#art" className="text-sm text-slate-700 hover:text-emerald-600 transition">Art</a>
              <a href="#travel" className="text-sm text-slate-700 hover:text-emerald-600 transition">Travel</a>
            </nav>
          </div>

          {/* Manage */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-900">Manage</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/my-events" className="text-sm text-slate-700 hover:text-emerald-600 transition">My Events</Link>
              <Link to="/create-event" className="text-sm text-slate-700 hover:text-emerald-600 transition">Create Event</Link>
              <Link to="/login" className="text-sm text-slate-700 hover:text-emerald-600 transition">Sign In</Link>
              <Link to="/signup" className="text-sm text-slate-700 hover:text-emerald-600 transition">Sign Up</Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-900">Support</h4>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Email:</span>
                <br />
                <a href="mailto:support@eventify.com" className="text-emerald-600 hover:text-emerald-700">support@eventify.com</a>
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">Phone:</span>
                <br />
                <a href="tel:+919876543210" className="text-emerald-600 hover:text-emerald-700">+91 98765 43210</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-emerald-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-700">
              © 2026 Eventify. All rights reserved.
            </p>
            <nav className="flex gap-6 text-sm">
              <a href="#privacy" className="text-slate-700 hover:text-emerald-600 transition">Privacy Policy</a>
              <a href="#terms" className="text-slate-700 hover:text-emerald-600 transition">Terms of Service</a>
              <a href="#cookies" className="text-slate-700 hover:text-emerald-600 transition">Cookie Policy</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
