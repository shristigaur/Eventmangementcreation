import { Link } from "react-router-dom";

export default function ModernEventCard({ event }) {
  return (
    <article className="bg-white rounded-[1.5rem] shadow-md overflow-hidden border border-emerald-100 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] transition duration-300">
      <div className="relative h-40">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            if (event.fallbackImage) {
              e.currentTarget.onerror = null;
              e.currentTarget.src = event.fallbackImage;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/35 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 bg-white/90 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
          {event.category || 'Featured'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 truncate">{event.title}</h3>
        <p className="text-sm text-slate-500 mt-2">{event.location} • {event.date}</p>
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/event/${event.id}`} className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-full shadow-sm hover:bg-emerald-700">View</Link>
          <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Free</div>
        </div>
      </div>
    </article>
  );
}
