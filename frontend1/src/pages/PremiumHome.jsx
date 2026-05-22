import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { eventAPI } from "../api/index.js";
import ModernNavbar from "../modern/ModernNavbar";
import ModernEventCard from "../modern/ModernEventCard";
import ModernFooter from "../modern/ModernFooter";

const filters = ["All", "Business", "Music", "Art", "Travel", "Festival"];

const imageBank = {
  hero: "/images/wedding-event.jpg",
  stage: "/images/stage-event.jpg",
  business: "/images/business-event.jpg",
  festival: "/images/festival-event.jpg",
  crowd: "/images/crowd-event.jpg",
  art: "/images/art-event.jpg",
  event: "/images/hero-event.jpg",
};

const events = [
  { id: 1, title: "Tech Conference 2026", date: "June 10, 2026", location: "Delhi", image: imageBank.business, fallbackImage: imageBank.hero, category: "Business" },
  { id: 2, title: "Music Fest", date: "July 5, 2026", location: "Mumbai", image: imageBank.festival, fallbackImage: imageBank.stage, category: "Festival" },
  { id: 3, title: "Startup Meetup", date: "Aug 20, 2026", location: "Bangalore", image: imageBank.stage, fallbackImage: imageBank.business, category: "Business" },
  { id: 4, title: "Art Exhibition", date: "Sept 12, 2026", location: "Jaipur", image: imageBank.art, fallbackImage: imageBank.art, category: "Art" },
  { id: 5, title: "Travel Expo", date: "Oct 2, 2026", location: "Goa", image: imageBank.event, fallbackImage: imageBank.crowd, category: "Travel" },
  { id: 6, title: "Festival Night", date: "Nov 18, 2026", location: "Pune", image: imageBank.crowd, fallbackImage: imageBank.festival, category: "Festival" },
];

const featureCards = [
  {
    icon: "✨",
    title: "Beautiful discovery",
    description: "Premium event cards, immersive imagery, and a cinematic browsing experience.",
  },
  {
    icon: "⚡",
    title: "Fast planning",
    description: "Create, organize, and manage events with a layout that feels like a real SaaS product.",
  },
  {
    icon: "🤝",
    title: "Audience ready",
    description: "Clean interactions, polished states, and intuitive paths for every user journey.",
  },
];

export default function PremiumHome() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [liveCount, setLiveCount] = useState(146);
  const [eventsData, setEventsData] = useState(events);
  const eventsSectionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveCount((current) => (current < 428 ? current + 4 : current));
    }, 55);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    if (location.pathname === "/events") {
      const timeoutId = window.setTimeout(() => {
        eventsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 180);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const response = await eventAPI.getAllEvents();
        const remoteEvents = Array.isArray(response.data?.data) ? response.data.data : [];

        if (isMounted && remoteEvents.length > 0) {
          setEventsData(
            remoteEvents.map((event, index) => ({
              ...event,
              fallbackImage: event.fallbackImage || imageBank.event,
              image: event.image || [imageBank.business, imageBank.festival, imageBank.stage, imageBank.art, imageBank.event, imageBank.crowd][index % 6],
            }))
          );
        }
      } catch {
        if (isMounted) {
          setEventsData(events);
        }
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesFilter = activeFilter === "All" || event.category === activeFilter;
      const matchesQuery = [event.title, event.location, event.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query, eventsData]);

  const scrollToEvents = () => {
    eventsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f4fbf6] text-slate-900">
      <ModernNavbar />

      <main className="modern-hero-wrap relative overflow-hidden">
        <div className="blob one floaty"></div>
        <div className="blob two floaty"></div>

        <section className="relative max-w-7xl mx-auto px-6 pt-10 md:pt-14 lg:pt-16 pb-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-7" data-reveal style={{ "--reveal-delay": "40ms" }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Find events that feel alive
              </div>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-5xl font-black tracking-tight text-slate-950 md:text-7xl text-motion">
                  Your Next
                  <span className="block bg-linear-to-r from-emerald-700 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Memory Starts Here
                  </span>
                </h1>
                <p className="max-w-xl text-base leading-8 text-slate-600 md:text-lg">
                  Discover curated business, travel, music, and art experiences with a startup-grade interface designed to feel premium, fast, and effortless.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-emerald-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-200 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-emerald-300"
                >
                  Explore Events
                </Link>
                <button
                  type="button"
                  onClick={() => navigate("/create-event")}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-7 py-3.5 text-sm font-semibold text-emerald-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-100"
                >
                  Create Event
                </button>
              </div>

              <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="glass-card rounded-2xl p-4" data-reveal style={{ "--reveal-delay": "120ms" }}>
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Live events</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">{liveCount.toLocaleString()}+</p>
                  <p className="text-sm text-slate-500">active listings</p>
                </div>
                <div className="glass-card rounded-2xl p-4" data-reveal style={{ "--reveal-delay": "180ms" }}>
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Creators</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">38k</p>
                  <p className="text-sm text-slate-500">event hosts</p>
                </div>
                <div className="glass-card rounded-2xl p-4" data-reveal style={{ "--reveal-delay": "240ms" }}>
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Rating</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">4.9/5</p>
                  <p className="text-sm text-slate-500">user satisfaction</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl"></div>
              </div>

              <div className="relative z-10 grid gap-4 md:grid-cols-5">
                <div className="md:col-span-3 overflow-hidden rounded-4xl border border-emerald-100 bg-white p-3 shadow-2xl shadow-emerald-100 media-card floaty">
                  <div className="relative overflow-hidden rounded-[1.75rem]">
                    <img
                      src={imageBank.hero}
                      alt="Event showcase"
                      className="h-80 w-full object-cover md:h-136"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-emerald-950/25 via-transparent to-transparent"></div>
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm glow-pulse">
                      Live event production
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/50 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Now playing</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">Stage setup, guest flow, and live energy</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-200">
                          ▶
                        </div>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
                        <div className="h-full w-2/3 rounded-full bg-linear-to-r from-emerald-500 to-emerald-700"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                  <div className="glass-card rounded-[1.75rem] p-4 md:p-5 drift-slow" data-reveal style={{ "--reveal-delay": "180ms" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-2xl text-emerald-700">🎤</div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Featured</p>
                        <p className="text-sm font-semibold text-slate-900">Conference and music stages</p>
                      </div>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-[1.35rem]">
                      <img src={imageBank.event} alt="Live event" className="h-36 w-full object-cover" />
                    </div>
                  </div>

                  <div className="glass-card rounded-[1.75rem] p-5 drift-fast" data-reveal style={{ "--reveal-delay": "260ms" }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200">+</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Modern event management</p>
                        <p className="text-xs text-slate-500">Clean schedules, lively visuals, and smooth planning.</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-[1.75rem] p-4" data-reveal style={{ "--reveal-delay": "320ms" }}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Photo wall</p>
                    <div className="grid grid-cols-2 gap-3">
                      <img src={imageBank.crowd} alt="Crowd photo" className="h-28 w-full rounded-2xl object-cover" />
                      <img src={imageBank.festival} alt="Lighting photo" className="h-28 w-full rounded-2xl object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {featureCards.map((card, index) => (
                  <article
                    key={card.title}
                    className="glass-card group rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-100"
                    data-reveal
                    style={{ "--reveal-delay": `${index * 110 + 260}ms` }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-lg text-emerald-700 transition duration-300 group-hover:scale-110">
                      {card.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-8 md:pb-10" data-reveal style={{ "--reveal-delay": "100ms" }}>
          <div className="glass-card rounded-4xl p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Search and filter</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950 md:text-3xl">Find the vibe you want</h2>
              </div>

              <div className="flex w-full max-w-xl gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search events, places, or themes"
                  className="min-w-0 flex-1 rounded-full border border-emerald-100 bg-white px-5 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
                <button
                  type="button"
                  onClick={scrollToEvents}
                  className="button-primary rounded-full px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {filters.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
                      active
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : "bg-[#f1f8f3] text-slate-700 hover:bg-emerald-50"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={eventsSectionRef} id="events" className="max-w-7xl mx-auto px-6 pb-16">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between" data-reveal style={{ "--reveal-delay": "140ms" }}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Upcoming events</p>
              <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">Fresh picks for every mood</h2>
            </div>
            <div className="text-sm text-slate-500">Curated with soft greens, clean whites, and layered motion.</div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="reveal-item"
                  data-reveal
                  style={{ "--reveal-delay": `${index * 120}ms` }}
                >
                  <ModernEventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-4xl p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No events match your filter.</p>
              <p className="mt-2 text-slate-500">Try another category or clear your search.</p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setQuery("");
                }}
                className="button-secondary mt-5 rounded-full px-5 py-3 font-semibold text-emerald-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <ModernFooter />
      </main>
    </div>
  );
}
