import { Link } from "react-router-dom";

const settings = [
  { title: "Email notifications", description: "Stay updated about your event activity.", enabled: true },
  { title: "Marketing emails", description: "Get product updates and new feature announcements.", enabled: false },
  { title: "Profile visibility", description: "Keep your profile visible to event guests.", enabled: true },
];

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#f4fbf6] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/home" className="inline-flex items-center gap-2 text-emerald-700 transition hover:text-emerald-800">
          <span className="text-2xl font-bold">←</span>
          <span className="font-medium">Back to home</span>
        </Link>

        <div className="glass-card mt-8 rounded-4xl p-8 md:p-10 shadow-2xl shadow-emerald-100">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-600">Settings</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Account preferences</h1>
          <p className="mt-2 text-slate-600">Adjust a few important settings for your Eventify account.</p>

          <div className="mt-8 space-y-4">
            {settings.map((setting) => (
              <div key={setting.title} className="glass-card rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{setting.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{setting.description}</p>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-sm font-semibold ${setting.enabled ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {setting.enabled ? "On" : "Off"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
