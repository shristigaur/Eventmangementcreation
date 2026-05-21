import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function ModernNavbar() {
  const readCurrentUser = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      return storedUser?.user || storedUser;
    } catch {
      return null;
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(readCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(readCurrentUser());
    };

    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    window.addEventListener("storage", syncUser);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("storage", syncUser);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const displayName = currentUser?.name || currentUser?.fullName || currentUser?.email || "Eventify user";
  const initials = (displayName || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setProfileOpen(false);
    navigate("/");
  };

  const isHomeRoute = location.pathname === "/home" || location.pathname === "/events" || location.pathname === "/modern";
  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "nav-link-active" : ""}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm shadow-emerald-100/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-emerald-700 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-200">E</div>
          <div className="text-lg font-semibold text-slate-900">Eventify</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-700">
          <NavLink to="/home" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/my-events" className={navClass}>
            My Events
          </NavLink>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="nav-pill">Business</span>
            <span className="nav-pill">Travel</span>
            <span className="nav-pill">Festivals</span>
          </div>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/create-event" className="button-secondary text-sm px-5 py-2.5 rounded-full font-medium">
            + Create Event
          </Link>
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                ref={profileButtonRef}
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="profile-trigger"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-200">
                  {initials}
                </span>
                <span className="max-w-35 truncate text-sm font-semibold text-slate-700">
                  {displayName}
                </span>
                <svg className={`h-4 w-4 text-slate-500 transition ${profileOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.017l3.71-3.785a.75.75 0 111.08 1.04l-4.24 4.33a.75.75 0 01-1.08 0l-4.24-4.33a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              <div className={`profile-menu ${profileOpen ? "profile-menu-open" : ""}`}>
                <div className="px-4 pt-4 pb-3 border-b border-emerald-100">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Signed in</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
                <div className="p-2">
                  <NavLink to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    View Profile
                  </NavLink>
                  <NavLink to="/my-events" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    My Events
                  </NavLink>
                  <NavLink to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                    Settings
                  </NavLink>
                  <button type="button" onClick={handleLogout} className="dropdown-item dropdown-item-danger">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="button-secondary text-sm px-4 py-2 font-medium">
                Sign in
              </Link>
              <Link to="/signup" className="button-primary text-sm px-5 py-2.5 font-medium text-white rounded-full shadow-md">
                Sign up
              </Link>
            </>
          )}
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
            <NavLink to="/home" className={({ isActive }) => `mobile-link ${isActive || isHomeRoute ? "mobile-link-active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/my-events" className={({ isActive }) => `mobile-link ${isActive ? "mobile-link-active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
              My Events
            </NavLink>
            <Link to="/create-event" className="button-secondary py-2.5 px-4 rounded-lg text-center font-medium" onClick={() => setMobileMenuOpen(false)}>
              + Create Event
            </Link>
            {currentUser ? (
              <>
                <div className="py-2 text-sm text-slate-600">Logged in as {displayName}</div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2 px-4 bg-rose-50 text-rose-700 rounded-lg text-center font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                <Link to="/signup" className="button-primary py-2 px-4 rounded-lg text-center font-medium text-white" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
