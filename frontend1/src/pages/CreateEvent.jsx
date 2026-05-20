import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ModernFooter from "../modern/ModernFooter";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Business",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Event title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.location) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      // Mock save - in real app, call API
      const events = JSON.parse(localStorage.getItem("createdEvents") || "[]");
      const newEvent = {
        id: Date.now(),
        ...formData,
        image: formData.image ? URL.createObjectURL(formData.image) : "/images/event-default.jpg",
      };
      events.push(newEvent);
      localStorage.setItem("createdEvents", JSON.stringify(events));
      navigate("/my-events");
    } else {
      setErrors(newErrors);
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

        <div className="bg-white/95 backdrop-blur-sm border border-emerald-100 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-emerald-100">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">Create Your Event</h1>
            <p className="text-slate-600 text-lg">Share your creative vision with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Conference 2026, Music Festival..."
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-base ${
                    errors.title ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                  }`}
                />
                {errors.title && <p className="text-sm text-red-600 mt-2">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell people what your event is about..."
                  rows="5"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none ${
                    errors.description ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                  }`}
                />
                {errors.description && <p className="text-sm text-red-600 mt-2">{errors.description}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                    errors.date ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                  }`}
                />
                {errors.date && <p className="text-sm text-red-600 mt-2">{errors.date}</p>}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                    errors.time ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                  }`}
                />
                {errors.time && <p className="text-sm text-red-600 mt-2">{errors.time}</p>}
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Delhi Convention Center, Mumbai Beach..."
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${
                    errors.location ? "border-red-300 bg-red-50" : "border-emerald-100 bg-emerald-50/30"
                  }`}
                />
                {errors.location && <p className="text-sm text-red-600 mt-2">{errors.location}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-100 bg-emerald-50/30 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option>Business</option>
                  <option>Music</option>
                  <option>Art</option>
                  <option>Travel</option>
                  <option>Festival</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-3">Event Image</label>
                <div className="relative border-2 border-dashed border-emerald-200 rounded-xl p-6 hover:border-emerald-400 transition cursor-pointer bg-emerald-50/20">
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-slate-700 font-medium">Click or drag to upload image</p>
                    <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                    {formData.image && <p className="text-sm text-emerald-600 mt-2">✓ {formData.image.name}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 transition duration-300 text-lg"
              >
                Create Event
              </button>
              <Link
                to="/"
                className="flex-1 bg-slate-100 text-slate-900 font-semibold py-4 rounded-xl hover:bg-slate-200 transition duration-300 text-center text-lg"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ModernFooter />
    </div>
  );
}
