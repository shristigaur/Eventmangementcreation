import { useEffect } from "react";
import ModernNavbar from "./ModernNavbar";
import ModernEventCard from "./ModernEventCard";
import ModernFooter from "./ModernFooter";

function createArt(title, colors) {
  const [start, end, accent] = colors;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="40" fill="url(#g)" />
      <circle cx="650" cy="120" r="110" fill="${accent}" opacity="0.2" />
      <circle cx="150" cy="480" r="140" fill="#ffffff" opacity="0.18" />
      <path d="M140 420 C220 330, 320 330, 410 410 S620 520, 720 380" stroke="#ffffff" stroke-opacity="0.5" stroke-width="18" stroke-linecap="round" />
      <rect x="70" y="70" width="210" height="56" rx="28" fill="#ffffff" fill-opacity="0.88" />
      <text x="100" y="107" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700" fill="#0f172a">${title}</text>
      <circle cx="590" cy="320" r="140" fill="#ffffff" fill-opacity="0.22" />
      <circle cx="590" cy="320" r="94" fill="#ffffff" fill-opacity="0.55" />
      <circle cx="590" cy="320" r="58" fill="${accent}" opacity="0.9" />
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const filters = ["All", "Business", "Music", "Art", "Travel"];

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
  { id: 1, title: "Tech Conference 2026", date: "June 10, 2026", location: "Delhi", image: imageBank.business, fallbackImage: createArt("Tech", ["#effaf2", "#c7eed4", "#047857"]), category: "Business" },
  { id: 2, title: "Music Fest", date: "July 5, 2026", location: "Mumbai", image: imageBank.festival, fallbackImage: createArt("Music", ["#f3fbf6", "#d9f7e5", "#059669"]), category: "Festival" },
  { id: 3, title: "Startup Meetup", date: "Aug 20, 2026", location: "Bangalore", image: imageBank.stage, fallbackImage: createArt("Startup", ["#ecfdf5", "#d1fae5", "#065f46"]), category: "Business" },
  { id: 4, title: "Art Exhibition", date: "Sept 12, 2026", location: "Jaipur", image: imageBank.art, fallbackImage: createArt("Art", ["#f0fdf4", "#dcfce7", "#15803d"]), category: "Art" },
  { id: 5, title: "Travel Expo", date: "Oct 2, 2026", location: "Goa", image: imageBank.event, fallbackImage: createArt("Travel", ["#f8fdf9", "#e2f8e9", "#047857"]), category: "Travel" },
  { id: 6, title: "Festival Night", date: "Nov 18, 2026", location: "Pune", image: imageBank.crowd, fallbackImage: createArt("Fest", ["#f0fdf4", "#e6f7eb", "#16a34a"]), category: "Festival" },
];

export default function ModernHome() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const revealItems = document.querySelectorAll("[data-reveal]");

    // Hide only after JS is ready, so content never stays invisible by default.
    revealItems.forEach((item) => {
      item.classList.add("will-reveal");
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        item.classList.add("is-visible");
      }
    });

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4fbf6]">
      <ModernNavbar />

      <main className="modern-hero-wrap relative overflow-hidden">
        <div className="blob one floaty"></div>
        <div className="blob two floaty"></div>

        <section className="max-w-7xl mx-auto px-6 py-10 md:py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="space-y-6 order-1" data-reveal style={{ "--reveal-delay": "0ms" }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm border border-emerald-100" data-reveal style={{ "--reveal-delay": "0ms" }}>
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Find events that feel alive
              </div>

              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900" data-reveal style={{ "--reveal-delay": "110ms" }}>
                  Your Next
                  <span className="block text-emerald-700">Memory Starts Here.</span>
                </h1>
                <p className="mt-4 max-w-xl text-base md:text-lg text-slate-600" data-reveal style={{ "--reveal-delay": "220ms" }}>
                  Discover business, travel, music, and art events crafted with bold ideas, immersive moments, and a playful creative energy.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-emerald-600 px-6 py-3 text-white font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition" data-reveal style={{ "--reveal-delay": "320ms" }}>Explore Events</button>
                <button className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-emerald-700 font-medium hover:bg-emerald-50 hover:-translate-y-0.5 transition" data-reveal style={{ "--reveal-delay": "420ms" }}>Create Event</button>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="rounded-2xl bg-white/90 p-4 shadow-sm border border-emerald-100" data-reveal style={{ "--reveal-delay": "520ms" }}>
                  <div className="text-2xl font-bold text-slate-900">2k+</div>
                  <div className="text-sm text-slate-500">attendees</div>
                </div>
                <div className="rounded-2xl bg-white/90 p-4 shadow-sm border border-emerald-100" data-reveal style={{ "--reveal-delay": "620ms" }}>
                  <div className="text-2xl font-bold text-slate-900">100+</div>
                  <div className="text-sm text-slate-500">events</div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end order-2" data-reveal style={{ "--reveal-delay": "120ms" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-72 w-72 md:h-104 md:w-104 rounded-full bg-emerald-100/70 blur-3xl"></div>
              </div>

              <div className="relative z-10 w-full max-w-xl">
                <div className="grid gap-4 md:grid-cols-5 items-stretch">
                  <div className="md:col-span-3 relative rounded-4xl bg-white p-3 shadow-2xl shadow-emerald-100 border border-emerald-100 floaty media-card" data-reveal style={{ "--reveal-delay": "220ms" }}>
                    <div className="overflow-hidden rounded-3xl bg-[#eefaf1] p-2">
                      <div className="relative overflow-hidden rounded-3xl bg-white">
                        <div className="absolute inset-0 bg-linear-to-tr from-emerald-950/20 via-transparent to-transparent"></div>
                        <img
                          src={imageBank.hero}
                          alt="Event showcase"
                          className="h-64 sm:h-80 md:h-108 w-full object-cover object-center"
                        />

                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm glow-pulse">
                          Live event production
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Now playing</p>
                              <p className="text-sm font-semibold text-slate-900">Stage setup, guest flow, and live energy</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">▶</div>
                            </div>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-emerald-100 overflow-hidden">
                            <div className="h-full w-2/3 rounded-full bg-linear-to-r from-emerald-500 to-emerald-700"></div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="overflow-hidden rounded-[1.25rem] bg-white border border-emerald-100 drift-slow" data-reveal style={{ "--reveal-delay": "340ms" }}>
                          <img
                            src={imageBank.business}
                            alt="Venue setup"
                            className="h-28 sm:h-32 md:h-36 w-full object-cover object-center"
                          />
                          <div className="p-3">
                            <p className="text-sm font-semibold text-slate-900">Venue setup</p>
                            <p className="text-xs text-slate-500">Lighting, seating, and flow</p>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[1.25rem] bg-white border border-emerald-100 drift-fast" data-reveal style={{ "--reveal-delay": "460ms" }}>
                          <img
                            src={imageBank.stage}
                            alt="Crew coordination"
                            className="h-28 sm:h-32 md:h-36 w-full object-cover object-center"
                          />
                          <div className="p-3">
                            <p className="text-sm font-semibold text-slate-900">Crew coordination</p>
                            <p className="text-xs text-slate-500">Speakers, timing, and guests</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white" data-reveal style={{ "--reveal-delay": "560ms" }}>
                          <img
                            src={imageBank.event}
                            alt="Expo hall"
                            className="h-28 md:h-32 w-full object-cover object-center"
                          />
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white" data-reveal style={{ "--reveal-delay": "660ms" }}>
                          <img
                            src={imageBank.art}
                            alt="Talk stage"
                            className="h-28 md:h-32 w-full object-cover object-center"
                          />
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white" data-reveal style={{ "--reveal-delay": "760ms" }}>
                          <img
                            src={imageBank.festival}
                            alt="Event crowd"
                            className="h-28 md:h-32 w-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="rounded-[1.75rem] bg-white p-4 shadow-xl shadow-emerald-100 border border-emerald-100 media-card drift-slow" data-reveal style={{ "--reveal-delay": "260ms" }}>
                      <div className="rounded-[1.25rem] bg-[#f1f8f3] p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center text-xl">🎤</div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Featured</p>
                            <p className="text-sm font-semibold text-slate-900">Conference and music stages</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-[1.25rem] overflow-hidden">
                        <img src={imageBank.event} alt="Live event" className="h-36 w-full object-cover" />
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-white p-4 shadow-lg shadow-emerald-100 border border-emerald-100 media-card drift-fast" data-reveal style={{ "--reveal-delay": "380ms" }}>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">+</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Modern event management</p>
                          <p className="text-xs text-slate-500">Clean schedules, lively visuals, and smooth planning.</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-white p-4 shadow-lg shadow-emerald-100 border border-emerald-100 media-card" data-reveal style={{ "--reveal-delay": "500ms" }}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Photo wall</p>
                      <div className="grid grid-cols-2 gap-3">
                        <img
                          src={imageBank.crowd}
                          alt="Crowd photo"
                          className="h-28 w-full rounded-2xl object-cover"
                        />
                        <img
                          src={imageBank.festival}
                          alt="Lighting photo"
                          className="h-28 w-full rounded-2xl object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 mt-2 md:mt-4 rounded-4xl bg-white/90 p-3 md:p-4 border border-emerald-100 shadow-xl shadow-emerald-100" data-reveal style={{ "--reveal-delay": "700ms" }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="group relative overflow-hidden rounded-[1.25rem] border border-emerald-100 bg-white">
                  <img src={imageBank.crowd} alt="Event crowd highlight" className="h-36 md:h-40 w-full object-cover object-center transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">Live crowd</div>
                </div>
                <div className="group relative overflow-hidden rounded-[1.25rem] border border-emerald-100 bg-white">
                  <img src={imageBank.stage} alt="Stage highlight" className="h-36 md:h-40 w-full object-cover object-center transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">Stage moments</div>
                </div>
                <div className="group relative overflow-hidden rounded-[1.25rem] border border-emerald-100 bg-white">
                  <img src={imageBank.art} alt="Guests highlight" className="h-36 md:h-40 w-full object-cover object-center transition duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">Creative vibe</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-8 md:pb-10 -mt-1 md:-mt-2" data-reveal style={{ "--reveal-delay": "120ms" }}>
          <div className="rounded-4xl bg-white/95 p-5 md:p-6 shadow-xl shadow-emerald-100 border border-emerald-100" data-reveal style={{ "--reveal-delay": "120ms" }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600" data-reveal style={{ "--reveal-delay": "200ms" }}>Search and filter</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900" data-reveal style={{ "--reveal-delay": "280ms" }}>Find the vibe you want</h2>
              </div>

              <div className="flex flex-1 max-w-xl gap-3">
                <input
                  type="text"
                  placeholder="Search events, places, or themes"
                  className="flex-1 rounded-full border border-emerald-100 bg-[#f8fdf9] px-5 py-3 outline-none focus:border-emerald-400"
                />
                <button className="rounded-full bg-emerald-600 px-6 py-3 text-white font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition">Search</button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${index === 0 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-[#f1f8f3] text-slate-700 hover:bg-emerald-50'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-emerald-100 bg-white p-3 shadow-lg shadow-emerald-100" data-reveal style={{ "--reveal-delay": "80ms" }}>
              <img src={imageBank.business} alt="Business events" className="h-32 w-full rounded-xl object-cover" />
              <p className="mt-3 text-sm font-semibold text-slate-900">Business</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white p-3 shadow-lg shadow-emerald-100" data-reveal style={{ "--reveal-delay": "180ms" }}>
              <img src={imageBank.festival} alt="Festival events" className="h-32 w-full rounded-xl object-cover" />
              <p className="mt-3 text-sm font-semibold text-slate-900">Festival</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white p-3 shadow-lg shadow-emerald-100" data-reveal style={{ "--reveal-delay": "280ms" }}>
              <img src={imageBank.art} alt="Art events" className="h-32 w-full rounded-xl object-cover" />
              <p className="mt-3 text-sm font-semibold text-slate-900">Art</p>
            </div>
          </div>

          <div className="mb-6 flex items-end justify-between gap-4" data-reveal style={{ "--reveal-delay": "140ms" }}>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600" data-reveal style={{ "--reveal-delay": "220ms" }}>Upcoming events</p>
              <h2 className="text-3xl font-bold text-slate-900" data-reveal style={{ "--reveal-delay": "300ms" }}>Fresh picks for every mood</h2>
            </div>
            <div className="hidden md:block text-sm text-slate-500">Curated with soft greens, clean whites, and layered motion.</div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event, index) => (
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
        </section>

        <ModernFooter />
      </main>
    </div>
  );
}
