import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { rsvpAPI } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";

function EventCard({ event, type, rsvpStatus, onRsvp, showAttendance = true }) {
  const eventId = event._id || event.id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentRsvpStatus, setCurrentRsvpStatus] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      if (!user || !eventId || String(eventId).length !== 24) {
        return;
      }

      try {
        const response = await rsvpAPI.getMyRsvp(eventId);
        if (isMounted) {
          setCurrentRsvpStatus(response.data?.status || null);
        }
      } catch {
        if (isMounted) {
          setCurrentRsvpStatus(null);
        }
      }
    };

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, [eventId, user]);

  const handleAttendance = async (status) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!eventId || String(eventId).length !== 24) {
      setRsvpError("This event is still demo data and cannot be saved yet.");
      return;
    }

    setIsUpdating(true);
    setRsvpError("");

    try {
      if (currentRsvpStatus === status) {
        await rsvpAPI.deleteRsvp(eventId);
        setCurrentRsvpStatus(null);
      } else if (currentRsvpStatus) {
        await rsvpAPI.updateRsvp(eventId, { status, guestCount: 1, comment: "" });
        setCurrentRsvpStatus(status);
      } else {
        await rsvpAPI.createRsvp(eventId, { status, guestCount: 1, comment: "" });
        setCurrentRsvpStatus(status);
      }
    } catch (error) {
      setRsvpError(error.response?.data?.message || "Unable to update RSVP.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300">

      <div className="relative">
        <img
          src={event.image}
          alt=""
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Featured
        </span>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold">{event.title}</h2>

        <p className="text-gray-500 text-sm mt-1">
          📅 {event.date}
        </p>

        <p className="text-gray-500 text-sm mb-3">
          📍 {event.location}
        </p>

        <Link
          to={`/event/${eventId}`}
          state={{ event }}
          className="block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          View Details
        </Link>

        {showAttendance ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleAttendance("going")}
              disabled={isUpdating}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${currentRsvpStatus === "going" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
            >
              Going
            </button>
            <button
              type="button"
              onClick={() => handleAttendance("maybe")}
              disabled={isUpdating}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${currentRsvpStatus === "maybe" ? "bg-yellow-500 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
            >
              Maybe
            </button>
            <button
              type="button"
              onClick={() => handleAttendance("decline")}
              disabled={isUpdating}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${currentRsvpStatus === "decline" ? "bg-rose-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
            >
              Not going
            </button>
          </div>
        ) : null}

        {type === "joined" && typeof onRsvp === "function" ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onRsvp(event._id || event.id, "going")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${rsvpStatus === "going" ? "bg-emerald-600 text-white" : "bg-white border border-emerald-100"}`}
            >
              ✓ Going
            </button>
            <button
              type="button"
              onClick={() => onRsvp(event._id || event.id, "maybe")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${rsvpStatus === "maybe" ? "bg-yellow-500 text-white" : "bg-white border border-emerald-100"}`}
            >
              ? Maybe
            </button>
            <button
              type="button"
              onClick={() => onRsvp(event._id || event.id, "decline")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${rsvpStatus === "decline" ? "bg-rose-600 text-white" : "bg-white border border-emerald-100"}`}
            >
              ✕ Decline
            </button>
          </div>
        ) : null}

        {showAttendance && rsvpError ? <p className="mt-2 text-xs font-medium text-rose-600">{rsvpError}</p> : null}
      </div>
    </div>
  );
}

export default EventCard;
