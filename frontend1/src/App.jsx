import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home";
import PremiumHome from "./pages/PremiumHome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { isAdminSession } from "./utils/adminAuth.js";

function isAuthenticated() {
  return Boolean(localStorage.getItem("user"));
}

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function PublicAuthRoute({ children }) {
  if (!isAuthenticated()) {
    return children;
  }

  return isAdminSession() ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />;
}

function AdminRoute({ children }) {
  return isAdminSession() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <PremiumHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <PremiumHome />
              </ProtectedRoute>
            }
          />
          <Route path="/basic" element={<Home />} />
          <Route
            path="/modern"
            element={
              <ProtectedRoute>
                <PremiumHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <Login />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicAuthRoute>
                <SignUp />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:id/edit"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
