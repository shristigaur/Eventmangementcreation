import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { eventAPI, rsvpAPI } from "../api/index.js";
import { isValidObjectId } from "../utils/idUtils.js";
import logger from "../utils/logger.js";
import ModernFooter from "../modern/ModernFooter";

const emptyRsvpCounts = {
  going: 0,
  maybe: 0,
  decline: 0,
  total: 0,
};

const rsvpCountKey = {
  going: "going",
  maybe: "maybe",
  decline: "decline",
};

export default function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpCounts, setRsvpCounts] = useState(emptyRsvpCounts);
  const [rsvpError, setRsvpError] = useState("");

  const updateRsvpCounts = (previousStatus, nextStatus) => {
    setRsvpCounts((current) => {
      const nextCounts = { ...current };
      const previousKey = rsvpCountKey[previousStatus];
      const nextKey = rsvpCountKey[nextStatus];

      if (previousKey) {
        nextCounts[previousKey] = Math.max(0, (nextCounts[previousKey] || 0) - 1);
      }

      if (nextKey) {
        nextCounts[nextKey] = (nextCounts[nextKey] || 0) + 1;
      }

      nextCounts.total = (nextCounts.going || 0) + (nextCounts.maybe || 0) + (nextCounts.decline || 0);
      return nextCounts;
    });
  };

  const fetchRsvpStatus = async () => {
    try {
      if (!isValidObjectId(String(id))) {
        setRsvpStatus(null);
        return;
      }

      console.log("[RSVP] Fetching current user's RSVP", { eventId: id });
      const rsvpRes = await rsvpAPI.getMyRsvp(id);
      const nextStatus = rsvpRes.data?.data?.status || null;
      setRsvpStatus(nextStatus);
      logger.stateUpdate("EventDetails", "rsvpStatus", nextStatus);
      console.log("[RSVP] Current RSVP loaded", rsvpRes.data?.data);
    } catch (err) {
      console.error("[RSVP] Failed to fetch current user's RSVP", err);
      logger.data("FETCH", "RSVP Status", { status: "not_rsvped" });
      setRsvpStatus(null);
    }
  };

  const fetchRsvpCounts = async () => {
    try {
      if (!isValidObjectId(String(id))) {
        setRsvpCounts(emptyRsvpCounts);
        return;
      }

      console.log("[RSVP] Fetching RSVP stats", { eventId: id });
      const statsRes = await rsvpAPI.getRsvpStats(id);
      const statsData = statsRes.data?.data || emptyRsvpCounts;
      setRsvpCounts({
        going: statsData.going || 0,
        maybe: statsData.maybe || 0,
        decline: statsData.decline || 0,
        total: statsData.total || 0,
      });
      console.log("[RSVP] RSVP stats loaded", statsData);
    } catch (err) {
      console.error("[RSVP] Failed to fetch RSVP stats", err);
      setRsvpCounts(emptyRsvpCounts);
    }
  };

  // Fetch event details on mount
  useEffect(() => {
    logger.lifecycle("EventDetails", "MOUNT");
    logger.data("FETCH", "Event", { eventId: id });

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        if (!isValidObjectId(String(id))) {
          // If id looks invalid, try to use location.state.event if provided
          if (location.state?.event) {
            setEvent(location.state.event);
            setError("");
            await fetchRsvpStatus();
            await fetchRsvpCounts();
            setIsLoading(false);
            return;
          }

          throw new Error('Invalid event ID');
        }

        const response = await eventAPI.getEventById(id);
        setEvent(response.data?.data || null);
        logger.stateUpdate("EventDetails", "event", response.data?.data || null);
        
        await fetchRsvpStatus();
        await fetchRsvpCounts();

        // Mock comments - replace with API call when available
        setComments([
          { id: 1, author: "Alex Kumar", text: "Really looking forward to this event!", timestamp: "2 hours ago", avatar: "👤" },
          { id: 2, author: "Priya Singh", text: "Can't wait! Are there any early bird tickets?", timestamp: "1 hour ago", avatar: "👩" },
        ]);
        
        setError("");
      } catch (err) {
        logger.apiError("GET", `/events/${id}`, err);
        if (location.state?.event) {
          setEvent(location.state.event);
          await fetchRsvpStatus();
          await fetchRsvpCounts();
          setError("");
        } else {
          setError(err.response?.data?.message || "Failed to load event");
          setEvent(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, location.state]);

  const handleRSVP = async (status) => {
    logger.userAction("RSVP", { eventId: id, status });
    setIsSubmittingRsvp(true);
    setRsvpError("");
    const previousStatus = rsvpStatus;

    try {
      if (rsvpStatus === status) {
        // Remove RSVP
        logger.data("DELETE", "RSVP", { eventId: id });
        console.log("[RSVP] Deleting RSVP", { eventId: id, status });
        await rsvpAPI.deleteRsvp(id);
        setRsvpStatus(null);
        updateRsvpCounts(previousStatus, null);
        logger.stateUpdate("EventDetails", "rsvpStatus", null);
        console.log("[RSVP] RSVP deleted", { eventId: id });
      } else {
        const payload = { status, guestCount: 1, comment: "" };
        const response = rsvpStatus
          ? await rsvpAPI.updateRsvp(id, payload)
          : await rsvpAPI.createRsvp(id, payload);

        setRsvpStatus(status);
        updateRsvpCounts(previousStatus, status);
        logger.stateUpdate("EventDetails", "rsvpStatus", status);
        console.log("[RSVP] RSVP saved", response.data?.data);
      }

      await fetchRsvpCounts();
    } catch (err) {
      logger.apiError(rsvpStatus === status ? "DELETE" : "POST", `/events/${id}/rsvp`, err);
      console.error("[RSVP] RSVP action failed", err);
      setRsvpError(err.response?.data?.message || "Unable to update RSVP. Please try again.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      logger.userAction("POST_COMMENT", { eventId: id });
      setIsSubmittingComment(true);
      try {
        logger.data("CREATE", "Comment", { eventId: id, text: newComment });
        await eventAPI.addComment(id, { text: newComment });
        setComments([
          ...comments,
          {
            id: comments.length + 1,
            author: "You",
            text: newComment,
            timestamp: "just now",
            avatar: "👤",
          },
        ]);
        logger.stateUpdate("EventDetails", "comments", `added comment`);
        setNewComment("");
      } catch (err) {
        logger.apiError("POST", `/events/${id}/comment`, err);
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f3fbf6] via-white to-[#ecfdf5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f3fbf6] via-white to-[#ecfdf5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-slate-600 mb-4">{error || "Event not found"}</p>
          <Link to="/home" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3fbf6] via-white to-[#ecfdf5]">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/home" className="inline-flex items-center gap-2 mb-8 text-emerald-700 hover:text-emerald-800 transition">
          <span className="text-2xl font-bold">←</span>
          <span className="font-medium">Back to home</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-4xl overflow-hidden shadow-2xl shadow-emerald-100">
          {/* Banner */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-block bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{event.title}</h1>
              <p className="text-emerald-100">Created by {event.creator}</p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* Details */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">About This Event</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">{event.description}</p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide mb-1">Date & Time</p>
                    <p className="text-lg font-bold text-slate-900">{event.date}</p>
                    <p className="text-slate-600">{event.time}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide mb-1">Location</p>
                    <p className="text-lg font-bold text-slate-900">📍 {event.location}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide mb-1">Attendees</p>
                    <p className="text-lg font-bold text-slate-900">{rsvpCounts.going.toLocaleString()}+</p>
                    <p className="text-slate-600">Maybe {rsvpCounts.maybe.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide mb-1">Status</p>
                    <p className="text-lg font-bold text-slate-900">Registration Open</p>
                    <p className="text-slate-600">Declined {rsvpCounts.decline.toLocaleString()}</p>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-6 mt-10 pt-10 border-t border-emerald-100">
                  <h3 className="text-2xl font-bold text-slate-900">Comments ({comments.length})</h3>

                  {/* Add Comment */}
                  <div className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this event..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 bg-emerald-50/30 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none"
                      rows="3"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={isSubmittingComment}
                      className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-50 border border-emerald-100 rounded-xl p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{comment.avatar}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-semibold text-slate-900">{comment.author}</p>
                              <p className="text-xs text-slate-500">{comment.timestamp}</p>
                            </div>
                            <p className="text-slate-700">{comment.text}</p>
                            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* RSVP Buttons */}
                <div className="bg-linear-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Will You Attend?</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleRSVP("going")}
                      disabled={isSubmittingRsvp}
                      className={`w-full py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        rsvpStatus === "going"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                          : "bg-white text-slate-900 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      {isSubmittingRsvp ? "⏳" : "✓"} Attending
                    </button>
                    <button
                      onClick={() => handleRSVP("maybe")}
                      disabled={isSubmittingRsvp}
                      className={`w-full py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        rsvpStatus === "maybe"
                          ? "bg-yellow-600 text-white shadow-lg shadow-yellow-200"
                          : "bg-white text-slate-900 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      {isSubmittingRsvp ? "⏳" : "?"} Maybe
                    </button>
                    <button
                      onClick={() => handleRSVP("decline")}
                      disabled={isSubmittingRsvp}
                      className={`w-full py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        rsvpStatus === "decline"
                          ? "bg-red-600 text-white shadow-lg shadow-red-200"
                          : "bg-white text-slate-900 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      {isSubmittingRsvp ? "⏳" : "✕"} Not Attending
                    </button>
                  </div>
                  {rsvpError && (
                    <p className="text-sm text-red-600 mt-4 text-center">
                      {rsvpError}
                    </p>
                  )}
                  {rsvpStatus && (
                    <p className="text-sm text-slate-600 mt-4 text-center">
                      ✓ You marked as {rsvpStatus === "maybe" ? "maybe attending" : rsvpStatus}
                    </p>
                  )}
                </div>

                {/* Share */}
                <div className="bg-white border border-emerald-100 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Share Event</h3>
                  <div className="space-y-2">
                    <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                      Facebook
                    </button>
                    <button className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium">
                      Twitter
                    </button>
                    <button className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition font-medium">
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModernFooter />
    </div>
  );
}
