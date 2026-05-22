import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventAPI, rsvpAPI } from "../api/index.js";
import { useAuth } from "../context/AuthContext";
import logger from "../utils/logger.js";
import ModernFooter from "../modern/ModernFooter";
import { isValidObjectId } from "../utils/idUtils.js";

const EventCard = ({ event, type, rsvpStatus, onRsvp }) => {
  const eventId = event._id || event.id;

  return (
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
          to={`/event/${eventId}`}
          state={{ event }}
          className="flex-1 bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-700 transition text-center"
        >
          View Details
        </Link>
        {type === "created" && (
          <Link
            to={`/event/${eventId}/edit`}
            className="flex-1 bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg hover:bg-slate-300 transition text-center"
          >
            Edit
          </Link>
        )}
      </div>

      {type === 'joined' && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => isValidObjectId(String(eventId)) && onRsvp(eventId, 'going')}
            className={`flex-1 py-2 rounded-lg font-semibold ${rsvpStatus === 'going' ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-100'}`}>
            ✓ Going
          </button>
          <button
            onClick={() => isValidObjectId(String(eventId)) && onRsvp(eventId, 'maybe')}
            className={`flex-1 py-2 rounded-lg font-semibold ${rsvpStatus === 'maybe' ? 'bg-yellow-500 text-white' : 'bg-white border border-emerald-100'}`}>
            ? Maybe
          </button>
          <button
            onClick={() => isValidObjectId(String(eventId)) && onRsvp(eventId, 'decline')}
            className={`flex-1 py-2 rounded-lg font-semibold ${rsvpStatus === 'decline' ? 'bg-red-600 text-white' : 'bg-white border border-emerald-100'}`}>
            ✕ Decline
          </button>
        </div>
      )}
    </div>
  </div>
  );
};

export default function MyEvents() {
  const [activeTab, setActiveTab] = useState("created");
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpMap, setRsvpMap] = useState({});
  const { user } = useAuth();

  // Fetch user's events on mount
  useEffect(() => {
    logger.lifecycle("MyEvents", "MOUNT");
    const fetchEvents = async () => {
      if (!user?._id) {
        logger.auth("NO_USER", { message: "User not found in context" });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [createdResult, joinedResult] = await Promise.allSettled([
          eventAPI.getUserEvents(user._id),
          eventAPI.getUserJoinedEvents(user._id),
        ]);

        if (createdResult.status === "fulfilled") {
          const createdList = Array.isArray(createdResult.value.data?.data) ? createdResult.value.data.data : [];
          setCreatedEvents(createdList);
          logger.stateUpdate("MyEvents", "createdEvents", `${createdList.length} events`);
        } else {
          logger.apiError("GET", `/users/${user._id}/events`, createdResult.reason);
          setCreatedEvents([]);
        }

        if (joinedResult.status === "fulfilled") {
          const joinedList = Array.isArray(joinedResult.value.data?.data) ? joinedResult.value.data.data : [];
          setJoinedEvents(joinedList);

          const map = {};
          joinedList.forEach((ev) => {
            map[ev._id] = null;
          });
          setRsvpMap(map);
          logger.stateUpdate("MyEvents", "joinedEvents", `${joinedList.length} events`);
        } else {
          logger.apiError("GET", `/users/${user._id}/joined-events`, joinedResult.reason);
          setJoinedEvents([]);
          setRsvpMap({});
        }

        if (createdResult.status === "rejected" && joinedResult.status === "rejected") {
          setError("Failed to load your events");
        } else if (createdResult.status === "rejected") {
          setError("Failed to load your created events");
        } else if (joinedResult.status === "rejected") {
          setError("Failed to load your joined events");
        }
      } catch (err) {
        logger.apiError("GET", `/users/${user._id}/events`, err);
        setError("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const refreshEvent = async (eventId) => {
    try {
      const res = await eventAPI.getEventById(eventId);
      const updated = res.data?.data;
      setCreatedEvents((prev) => prev.map((e) => (e._id === eventId ? updated : e)));
      setJoinedEvents((prev) => prev.map((e) => (e._id === eventId ? updated : e)));
    } catch {
      // ignore
    }
  };

  const handleRsvp = async (eventId, status) => {
    try {
      const current = rsvpMap[eventId];
      if (current === status) {
        // remove
        await rsvpAPI.removeRsvp(eventId);
        setRsvpMap((m) => ({ ...m, [eventId]: null }));
      } else {
        await rsvpAPI.addRsvp(eventId, { status, guestCount: 1 });
        setRsvpMap((m) => ({ ...m, [eventId]: status }));
      }
      await refreshEvent(eventId);
    } catch (err) {
      console.error('RSVP error', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3fbf6] via-white to-[#ecfdf5]">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link to="/home" className="inline-flex items-center gap-2 mb-8 text-emerald-700 hover:text-emerald-800 transition">
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
            📝 Created ({createdEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "joined"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                : "text-slate-700 hover:bg-emerald-50"
            }`}
          >
            ✓ Joined ({joinedEvents.length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading your events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && (
          <div>
            {activeTab === "created" ? (
              <div>
                {createdEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdEvents.map((event) => (
                      <EventCard key={event._id || event.id} event={event} type="created" showAttendance={false} />
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
                {joinedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {joinedEvents.map((event) => (
                      <EventCard
                        key={event._id || event.id}
                        event={event}
                        type="joined"
                        showAttendance={false}
                        rsvpStatus={rsvpMap[event._id]}
                        onRsvp={handleRsvp}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-2xl p-12 text-center">
                    <p className="text-2xl mb-2">🎭</p>
                    <p className="text-xl font-bold text-slate-900 mb-2">No events joined yet</p>
                    <p className="text-slate-600 mb-6">Explore and RSVP to events to add them here</p>
                    <Link
                      to="/home"
                      className="inline-block bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition"
                    >
                      Explore Events
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {activeTab === "created" && createdEvents.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/create-event"
              className="inline-block bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 transition"
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
