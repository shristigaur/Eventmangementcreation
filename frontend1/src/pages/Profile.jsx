import { Link } from "react-router-dom";

function getCurrentUser() {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    return storedUser?.user || storedUser;
  } catch {
    return null;
  }
}

export default function Profile() {
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name || currentUser?.fullName || "Eventify User";
  const initials = (displayName || currentUser?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f4fbf6] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/home" className="inline-flex items-center gap-2 text-emerald-700 transition hover:text-emerald-800">
          <span className="text-2xl font-bold">←</span>
          <span className="font-medium">Back to home</span>
        </Link>

        <div className="glass-card mt-8 rounded-4xl p-8 md:p-10 shadow-2xl shadow-emerald-100">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-emerald-500 text-2xl font-bold text-white shadow-lg shadow-emerald-200">
              {initials}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">View Profile</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">{displayName}</h1>
              <p className="mt-2 text-slate-600">{currentUser?.email || "No email saved yet"}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Plan</p>
              <p className="mt-2 text-lg font-bold text-slate-900">Premium Creator</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Status</p>
              <p className="mt-2 text-lg font-bold text-slate-900">Active member</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Events</p>
              <p className="mt-2 text-lg font-bold text-slate-900">12 created</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
