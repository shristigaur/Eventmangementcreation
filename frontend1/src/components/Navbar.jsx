import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-blue-600">Eventify</h1>

      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/create" className="hover:text-blue-500">Create Event</Link>
        <Link to="/my-events" className="hover:text-blue-500">My Events</Link>
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;