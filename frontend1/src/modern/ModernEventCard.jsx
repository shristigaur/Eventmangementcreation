import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { rsvpAPI } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidObjectId } from "../utils/idUtils.js";

const rsvpLabels = {
	going: "Going",
	maybe: "Maybe",
	decline: "Not going",
};

export default function ModernEventCard({ event }) {
  const eventId = event._id || event.id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      if (!user || !eventId || !isValidObjectId(String(eventId))) {
        return;
      }

      try {
        const response = await rsvpAPI.getMyRsvp(eventId);
        if (isMounted) {
          setRsvpStatus(response.data?.data?.status || null);
        }
      } catch {
        if (isMounted) {
          setRsvpStatus(null);
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

    if (!eventId || !isValidObjectId(String(eventId))) {
      setRsvpError("This event is demo/demo-data and cannot be saved yet.");
      return;
    }

    setIsUpdating(true);
    setRsvpError("");

    try {
      if (rsvpStatus === status) {
        await rsvpAPI.deleteRsvp(eventId);
        setRsvpStatus(null);
      } else if (rsvpStatus) {
        await rsvpAPI.updateRsvp(eventId, { status, guestCount: 1, comment: "" });
        setRsvpStatus(status);
      } else {
        await rsvpAPI.createRsvp(eventId, { status, guestCount: 1, comment: "" });
        setRsvpStatus(status);
      }
    } catch (error) {
      setRsvpError(error.response?.data?.message || "Unable to update RSVP.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article className="glass-card group overflow-hidden rounded-[1.75rem] border border-emerald-100 shadow-lg transition duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-100">
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          onError={(e) => {
            if (event.fallbackImage) {
              e.currentTarget.onerror = null;
              e.currentTarget.src = event.fallbackImage;
            }
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950/45 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
          {event.category || 'Featured'}
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-950">{event.title}</h3>
        <p className="mt-2 text-sm text-slate-500">{event.location} • {event.date}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Link to={`/event/${eventId}`} state={{ event }} className="button-primary rounded-full px-4 py-2 text-sm font-semibold text-white">
            View Details
          </Link>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {rsvpStatus ? rsvpLabels[rsvpStatus] : "Free entry"}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleAttendance("going")}
            disabled={isUpdating}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${rsvpStatus === "going" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
          >
            Going
          </button>
          <button
            type="button"
            onClick={() => handleAttendance("maybe")}
            disabled={isUpdating}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${rsvpStatus === "maybe" ? "bg-yellow-500 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
          >
            Maybe
          </button>
          <button
            type="button"
            onClick={() => handleAttendance("decline")}
            disabled={isUpdating}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${rsvpStatus === "decline" ? "bg-rose-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
          >
            Not going
          </button>
        </div>

        {rsvpError ? <p className="mt-3 text-xs font-medium text-rose-600">{rsvpError}</p> : null}
      </div>
    </article>
  );
}
