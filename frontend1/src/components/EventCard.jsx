import { Link } from "react-router-dom";

function EventCard({ event }) {
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
          to={`/event/${event.id}`}
          className="block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;