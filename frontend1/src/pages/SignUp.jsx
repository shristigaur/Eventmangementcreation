import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logger from "../utils/logger.js";

const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5001").trim().replace(/\/+$/, "");
const healthUrl = backendBaseUrl.endsWith("/api")
  ? `${backendBaseUrl.slice(0, -4)}/health`
  : `${backendBaseUrl}/health`;

const useBackendHealth = () => {
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    const checkBackend = async () => {
      try {
        const response = await fetch(healthUrl, { cache: "no-store" });
        if (!isMounted) return;
        setBackendStatus(response.ok ? "online" : "offline");
      } catch {
        if (!isMounted) return;
        setBackendStatus("offline");
      }
    };

    void checkBackend();

    const timerId = window.setInterval(checkBackend, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(timerId);
    };
  }, []);

  return backendStatus;
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const backendStatus = useBackendHealth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    logger.validation("SignUp", Object.keys(newErrors).length === 0, newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    logger.stateUpdate("SignUp", `formData.${name}`, value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    logger.userAction("SIGNUP_ATTEMPT", { email: formData.email });

    if (backendStatus === "offline") {
      setSignupError("Backend is offline. Start the API server on port 5001 and try again.");
      return;
    }
    
    setSignupError("");
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      logger.data("REGISTER", "User", { email: formData.email, name: formData.fullName });
      
      const result = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      setIsLoading(false);

      if (result.success) {
        logger.auth("SIGNUP_SUCCESS", { userId: result.user._id, email: formData.email });
        navigate("/home");
      } else {
        logger.auth("SIGNUP_FAILED", { error: result.error });
        setSignupError(result.error || "Registration failed");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3fbf6] via-white to-[#ecfdf5] flex items-center justify-center px-6 py-10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-emerald-700 hover:text-emerald-800 transition">
          <span className="text-2xl font-bold">←</span>
          <span className="font-medium">Back to home</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-4xl p-8 shadow-2xl shadow-emerald-100">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Join Eventify and discover amazing events</p>
              {backendStatus === "checking" && (
                <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Checking API connection...
                </p>
              )}
              {backendStatus === "offline" && (
                <p className="mt-3 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  Backend offline - registration is temporarily unavailable
                </p>
              )}
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            {signupError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {signupError}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                  errors.fullName ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                }`}
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                  errors.email ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                }`}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                    errors.password ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-emerald-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                    errors.confirmPassword ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-emerald-700"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="w-4 h-4 rounded accent-emerald-600 mt-1" required />
              <p className="text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="text-emerald-600 hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || backendStatus !== "online"}
              className="w-full bg-linear-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {backendStatus === "offline" ? "API Offline" : isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-500">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="px-4 py-2.5 border border-emerald-100 rounded-xl hover:bg-emerald-50 transition font-medium text-slate-700">
              Google
            </button>
            <button className="px-4 py-2.5 border border-emerald-100 rounded-xl hover:bg-emerald-50 transition font-medium text-slate-700">
              GitHub
            </button>
          </div>

          <p className="text-center text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
