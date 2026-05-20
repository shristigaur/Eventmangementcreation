import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Mock login - in real app, call API
      localStorage.setItem("user", JSON.stringify({ email, role: "user" }));
      navigate("/");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3fbf6] via-white to-[#ecfdf5] flex items-center justify-center px-6 py-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-emerald-700 hover:text-emerald-800 transition">
          <span className="text-2xl font-bold">←</span>
          <span className="font-medium">Back to home</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-[2rem] p-8 shadow-2xl shadow-emerald-100">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your Eventify account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                  errors.email ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                }`}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                  errors.password ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                }`}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded accent-emerald-600" />
                <span className="text-slate-700">Remember me</span>
              </label>
              <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-500">Or continue with</span>
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
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
