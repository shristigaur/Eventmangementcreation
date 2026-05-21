import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { eventAPI } from "../api/index.js";

const fallbackEvents = [
  {
    id: 1,
    title: "Tech Conference 2026",
    date: "June 10, 2026",
    location: "Delhi",
    image: "https://source.unsplash.com/400x300/?conference",
  },
  {
    id: 2,
    title: "Music Fest",
    date: "July 5, 2026",
    location: "Mumbai",
    image: "https://source.unsplash.com/400x300/?music",
  },
  {
    id: 3,
    title: "Startup Meetup",
    date: "August 20, 2026",
    location: "Bangalore",
    image: "https://source.unsplash.com/400x300/?startup",
  },
  {
    id: 4,
    title: "Art Exhibition",
    date: "September 12, 2026",
    location: "Jaipur",
    image: "https://source.unsplash.com/400x300/?art",
  },
];

function Home() {
  const [events, setEvents] = useState(fallbackEvents);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const response = await eventAPI.getAllEvents();
        const remoteEvents = Array.isArray(response.data?.data) ? response.data.data : [];
        if (isMounted && remoteEvents.length > 0) {
          setEvents(remoteEvents);
        }
      } catch {
        if (isMounted) {
          setEvents(fallbackEvents);
        }
      }
    };

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* 🔥 HERO SECTION */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Amazing Events
        </h1>
        <p className="mb-6 text-lg">
          Find, join, and create events around you
        </p>

        {/* 🔍 Search Bar */}
        <div className="max-w-xl mx-auto flex bg-white rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 px-4 py-3 text-black outline-none"
          />
          <button className="bg-blue-500 px-6">Search</button>
        </div>
      </div>

      {/* 🎯 CATEGORY FILTER */}
      <div className="flex justify-center gap-4 mt-6 flex-wrap px-4">
        {["All", "Tech", "Music", "Art", "Business"].map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 bg-white shadow rounded-full hover:bg-blue-500 hover:text-white transition"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🧾 EVENTS SECTION */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event._id || event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;