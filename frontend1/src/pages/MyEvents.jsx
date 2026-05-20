import { useState } from "react";
import { Link } from "react-router-dom";
import ModernFooter from "../modern/ModernFooter";

const mockMyEvents = {
  created: [
    {
      id: 101,
      title: "Summer Tech Bootcamp",
      description: "A 2-week intensive bootcamp for aspiring developers",
      date: "July 15, 2026",
      time: "10:00 AM",
      location: "Bangalore Tech Hub",
      image: "/images/business-event.jpg",
      category: "Business",
      attendees: 156,
      yourRole: "Creator",
    },
    {
      id: 102,
      title: "Art Workshop",
      description: "Learn digital art from industry professionals",
      date: "August 1, 2026",
      time: "02:00 PM",
      location: "Delhi Art Center",
      image: "/images/art-event.jpg",
      category: "Art",
      attendees: 45,
      yourRole: "Creator",
    },
  ],
  joined: [
    {
      id: 201,
      title: "Web Development Conference",
      description: "Latest trends in web development",
      date: "June 20, 2026",
      time: "09:00 AM",
      location: "Mumbai Convention Center",
      image: "/images/stage-event.jpg",
      category: "Business",
      attendees: 890,
      yourRole: "Attendee",
    },
    {
      id: 202,
      title: "Jazz Night",
      description: "Live jazz performances from renowned artists",
      date: "July 10, 2026",
      time: "07:00 PM",
      location: "Mumbai Beach Club",
      image: "/images/festival-event.jpg",
      category: "Festival",
      attendees: 320,
      yourRole: "Attendee",
    },
  ],
};

const EventCard = ({ event, type }) => (
  <div className="group bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300" data-reveal>
    <div className="relative h-48 overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      />
      <div className="absolute top-3 right-3">
        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {event.category}
        </span>
      </div>
      {type === "created" && (
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            My Event
          </span>
        </div>
      )}
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>

      <div className="space-y-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="text-lg">📅</span>
          <span>{event.date} at {event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="text-lg">📍</span>
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="text-lg">👥</span>
          <span>{event.attendees} attending</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to={`/event/${event.id}`}
          className="flex-1 bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700 transition text-center"
        >
          View Details
        </Link>
        {type === "created" && (
          <button className="flex-1 bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg hover:bg-slate-300 transition">
            Edit
          </button>
        )}
      </div>
    </div>
  </div>
);

export default function MyEvents() {
  const [activeTab, setActiveTab] = useState("created");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3fbf6] via-white to-[#ecfdf5]">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-emerald-700 hover:text-emerald-800 transition">
          <span className="text-2xl font-bold">←</span>
          <span className="font-medium">Back to home</span>
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">My Events</h1>
          <p className="text-slate-600 text-lg">Track events you've created and joined</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-10 bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("created")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "created"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "text-slate-700 hover:bg-emerald-50"
            }`}
          >
            📝 Created ({mockMyEvents.created.length})
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "joined"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "text-slate-700 hover:bg-emerald-50"
            }`}
          >
            ✓ Joined ({mockMyEvents.joined.length})
          </button>
        </div>

        {/* Events Grid */}
        <div>
          {activeTab === "created" ? (
            <div>
              {mockMyEvents.created.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockMyEvents.created.map((event) => (
                    <EventCard key={event.id} event={event} type="created" />
                  ))}
                </div>
              ) : (
                <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-2xl p-12 text-center">
                  <p className="text-2xl mb-2">📭</p>
                  <p className="text-xl font-bold text-slate-900 mb-2">No events created yet</p>
                  <p className="text-slate-600 mb-6">Start creating your first event to bring people together</p>
                  <Link
                    to="/create-event"
                    className="inline-block bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition"
                  >
                    Create Your First Event
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div>
              {mockMyEvents.joined.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockMyEvents.joined.map((event) => (
                    <EventCard key={event.id} event={event} type="joined" />
                  ))}
                </div>
              ) : (
                <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-2xl p-12 text-center">
                  <p className="text-2xl mb-2">🎭</p>
                  <p className="text-xl font-bold text-slate-900 mb-2">No events joined yet</p>
                  <p className="text-slate-600 mb-6">Explore and RSVP to events to add them here</p>
                  <Link
                    to="/"
                    className="inline-block bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition"
                  >
                    Explore Events
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        {activeTab === "created" && mockMyEvents.created.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/create-event"
              className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 transition"
            >
              + Create Another Event
            </Link>
          </div>
        )}
      </div>
      <ModernFooter />
    </div>
  );
}
