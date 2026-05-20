import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModernFooter from "../modern/ModernFooter";

const mockEvents = {
  1: {
    id: 1,
    title: "Tech Conference 2026",
    description: "Join us for the biggest tech conference of the year. Learn from industry leaders, network with innovators, and discover the latest technologies shaping our future.",
    date: "June 10, 2026",
    time: "09:00 AM",
    location: "Delhi Convention Center",
    image: "/images/business-event.jpg",
    category: "Business",
    attendees: 2450,
    creator: "John Doe",
    rsvpStatus: null,
  },
  2: {
    id: 2,
    title: "Music Fest",
    description: "Experience the ultimate music festival with world-class artists, food trucks, and amazing vibes. Three days of non-stop entertainment!",
    date: "July 5, 2026",
    time: "06:00 PM",
    location: "Mumbai Beach",
    image: "/images/festival-event.jpg",
    category: "Festival",
    attendees: 5200,
    creator: "Jane Smith",
    rsvpStatus: null,
  },
};

const mockComments = [
  { id: 1, author: "Alex Kumar", text: "Really looking forward to this event!", timestamp: "2 hours ago", avatar: "👤" },
  { id: 2, author: "Priya Singh", text: "Can't wait! Are there any early bird tickets?", timestamp: "1 hour ago", avatar: "👩" },
];

export default function EventDetails() {
  const { id } = useParams();
  const event = mockEvents[id] || mockEvents[1];
  
  const [rsvpStatus, setRsvpStatus] = useState(event.rsvpStatus);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");

  const handleRSVP = (status) => {
    setRsvpStatus(rsvpStatus === status ? null : status);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
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
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3fbf6] via-white to-[#ecfdf5]">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-emerald-700 hover:text-emerald-800 transition">
          <span className="text-2xl font-bold">←</span>
          <span className="font-medium">Back to home</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-100">
          {/* Banner */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
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
                    <p className="text-lg font-bold text-slate-900">{event.attendees.toLocaleString()}+</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wide mb-1">Status</p>
                    <p className="text-lg font-bold text-slate-900">Registration Open</p>
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
                      className="bg-emerald-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-emerald-700 transition"
                    >
                      Post Comment
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
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Will You Attend?</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleRSVP("attending")}
                      className={`w-full py-3 rounded-xl font-semibold transition duration-300 ${
                        rsvpStatus === "attending"
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                          : "bg-white text-slate-900 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      ✓ Attending
                    </button>
                    <button
                      onClick={() => handleRSVP("maybe")}
                      className={`w-full py-3 rounded-xl font-semibold transition duration-300 ${
                        rsvpStatus === "maybe"
                          ? "bg-yellow-600 text-white shadow-lg shadow-yellow-200"
                          : "bg-white text-slate-900 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      ? Maybe
                    </button>
                    <button
                      onClick={() => handleRSVP("decline")}
                      className={`w-full py-3 rounded-xl font-semibold transition duration-300 ${
                        rsvpStatus === "decline"
                          ? "bg-red-600 text-white shadow-lg shadow-red-200"
                          : "bg-white text-slate-900 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      ✕ Decline
                    </button>
                  </div>
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
