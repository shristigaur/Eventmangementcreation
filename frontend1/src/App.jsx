import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModernHome from "./modern/ModernHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModernHome />} />
        <Route path="/basic" element={<Home />} />
        <Route path="/modern" element={<ModernHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;