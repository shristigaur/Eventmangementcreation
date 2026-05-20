import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModernHome from "./modern/ModernHome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModernHome />} />
        <Route path="/basic" element={<Home />} />
        <Route path="/modern" element={<ModernHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;