import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModernHome from "./modern/ModernHome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModernHome />} />
        <Route path="/basic" element={<Home />} />
        <Route path="/modern" element={<ModernHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/my-events" element={<MyEvents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;