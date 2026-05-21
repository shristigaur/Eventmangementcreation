import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import adminAPI from "../api/adminAPI.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getStoredUser, isAdminSession } from "../utils/adminAuth.js";

const statBlueprints = [
	{ label: "Total Subscribers", keys: ["totalSubscribers", "subscribers", "subscribersCount", "total_subscribers"], accent: "from-emerald-600 to-emerald-500", icon: "👥" },
	{ label: "Total Posts", keys: ["totalPosts", "posts", "postsCount", "total_posts"], accent: "from-teal-600 to-teal-500", icon: "📝" },
	{ label: "Total Experience", keys: ["totalExperience", "experience", "experienceCount", "total_experience"], accent: "from-cyan-600 to-cyan-500", icon: "⭐" },
	{ label: "Total Contests", keys: ["totalContests", "contests", "contestsCount", "total_contests"], accent: "from-lime-600 to-lime-500", icon: "🏆" },
	{ label: "Total Meetups", keys: ["totalMeetups", "meetups", "meetupsCount", "total_meetups"], accent: "from-emerald-700 to-teal-600", icon: "📍" },
];

const rsvpStatusOptions = ["going", "not going", "interested"];

const emptyEventForm = {
	title: "",
	description: "",
	date: "",
	location: "",
	category: "",
	image: "",
	status: "scheduled",
};

function unwrapPayload(payload) {
	return payload?.data ?? payload?.stats ?? payload?.result ?? payload?.items ?? payload?.list ?? payload;
}

function toList(payload) {
	const data = unwrapPayload(payload);
	return Array.isArray(data) ? data : [];
}

function numberValue(value) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value) {
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0, notation: "compact" }).format(numberValue(value));
}

function formatDateTime(value) {
	if (!value) {
		return "—";
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "—";
	}

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

function readFromObject(source, keys) {
	for (const key of keys) {
		if (source && source[key] != null) {
			return source[key];
		}
	}

	return 0;
}

function normalizeStats(payload) {
	const data = unwrapPayload(payload) || {};

	if (Array.isArray(data)) {
		return data.map((item, index) => ({
			label: item.label || item.name || statBlueprints[index]?.label || `Metric ${index + 1}`,
			value: numberValue(item.value ?? item.count ?? item.total ?? 0),
			accent: statBlueprints[index]?.accent || "from-emerald-600 to-emerald-500",
			icon: statBlueprints[index]?.icon || "•",
		}));
	}

	return statBlueprints.map((blueprint) => ({
		...blueprint,
		value: numberValue(readFromObject(data, blueprint.keys)),
	}));
}

function normalizeSeries(payload, fallbackLabels = []) {
	const data = unwrapPayload(payload);

	if (Array.isArray(data)) {
		return data.map((item, index) => ({
			label: item.label || item.name || item.type || fallbackLabels[index] || `Item ${index + 1}`,
			value: numberValue(item.value ?? item.count ?? item.total ?? item.amount ?? 0),
			meta: item.meta || item.secondary || item.note || "",
		}));
	}

	if (data && typeof data === "object") {
		return Object.entries(data).map(([label, value]) => ({
			label,
			value: numberValue(typeof value === "object" ? value.value ?? value.count ?? value.total ?? 0 : value),
			meta: typeof value === "object" ? value.secondary || value.meta || "" : "",
		}));
	}

	return [];
}

async function loadAdminDashboardData({
	setLoading,
	setDashboardError,
	setStats,
	setEngagement,
	setTopDestinations,
	setScheduledEvents,
	setMonthlyEngagement,
	setEvents,
	setSelectedEventId,
}) {
	setLoading(true);
	setDashboardError("");

	const requests = await Promise.allSettled([
		adminAPI.getStats(),
		adminAPI.getEngagement(),
		adminAPI.getTopDestinations(),
		adminAPI.getScheduledEvents(),
		adminAPI.getMonthlyEngagement(),
		adminAPI.getEvents(),
	]);

	const [statsResult, engagementResult, destinationsResult, scheduledResult, monthlyResult, eventsResult] = requests;

	if (statsResult.status === "fulfilled") setStats(normalizeStats(statsResult.value.data));
	if (engagementResult.status === "fulfilled") setEngagement(normalizeSeries(engagementResult.value.data, ["Like", "Comment", "Share"]));
	if (destinationsResult.status === "fulfilled") setTopDestinations(normalizeSeries(destinationsResult.value.data));
	if (scheduledResult.status === "fulfilled") setScheduledEvents(normalizeSeries(scheduledResult.value.data));
	if (monthlyResult.status === "fulfilled") setMonthlyEngagement(normalizeSeries(monthlyResult.value.data));
	if (eventsResult.status === "fulfilled") {
		const nextEvents = toList(eventsResult.value.data);
		setEvents(nextEvents);
		setSelectedEventId((current) => current || String(nextEvents[0]?._id || nextEvents[0]?.id || ""));
	}

	const failures = requests.filter((result) => result.status === "rejected");
	if (failures.length > 0) {
		setDashboardError("Some admin panels could not be loaded from the backend yet.");
	}

	setLoading(false);
}

async function loadAdminRsvps({ eventId, setRsvps, setRsvpLoading, setDashboardError }) {
	if (!eventId) {
		setRsvps([]);
		return;
	}

	setRsvpLoading(true);
	try {
		const response = await adminAPI.getEventRsvps(eventId);
		setRsvps(toList(response.data));
	} catch (error) {
		setRsvps([]);
		setDashboardError(error.response?.data?.message || "Failed to load RSVPs for the selected event.");
	} finally {
		setRsvpLoading(false);
	}
}

function StatCard({ stat }) {
	return (
		<div className="rounded-[1.75rem] border border-emerald-100 bg-white/95 p-5 shadow-lg shadow-emerald-100/50 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">{stat.label}</p>
					<p className="mt-3 text-3xl font-black text-slate-900">{formatNumber(stat.value)}</p>
				</div>
				<div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${stat.accent} text-lg text-white shadow-lg shadow-emerald-200`}>
					{stat.icon}
				</div>
			</div>
		</div>
	);
}

function SectionCard({ title, subtitle, children, action, ...rest }) {
	return (
		<section {...rest} className="rounded-4xl border border-emerald-100 bg-white/95 p-5 shadow-xl shadow-emerald-100/50 backdrop-blur-sm md:p-6">
			<div className="mb-5 flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">{title}</h2>
					{subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
				</div>
				{action}
			</div>
			{children}
		</section>
	);
}

function MiniBars({ items, heightClass = "h-44" }) {
	const maxValue = Math.max(...items.map((item) => item.value), 1);

	return (
		<div className={`flex items-end gap-3 ${heightClass}`}>
			{items.map((item) => {
				const percent = Math.max((item.value / maxValue) * 100, 6);
				return (
					<div key={item.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2 text-center">
						<div className="flex w-full items-end justify-center">
							<div className="w-full max-w-12 rounded-t-2xl bg-linear-to-t from-emerald-600 via-emerald-500 to-teal-400 shadow-lg shadow-emerald-200" style={{ height: `${percent}%` }} />
						</div>
						<div>
							<p className="text-xs font-semibold text-slate-900">{item.label}</p>
							<p className="text-[11px] text-slate-500">{formatNumber(item.value)}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default function AdminDashboard() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const currentUser = getStoredUser();

	const [loading, setLoading] = useState(true);
	const [dashboardError, setDashboardError] = useState("");
	const [stats, setStats] = useState([]);
	const [engagement, setEngagement] = useState([]);
	const [topDestinations, setTopDestinations] = useState([]);
	const [scheduledEvents, setScheduledEvents] = useState([]);
	const [monthlyEngagement, setMonthlyEngagement] = useState([]);
	const [events, setEvents] = useState([]);
	const [selectedEventId, setSelectedEventId] = useState("");
	const [rsvps, setRsvps] = useState([]);
	const [rsvpLoading, setRsvpLoading] = useState(false);
	const [editingRsvpId, setEditingRsvpId] = useState("");
	const [savingEvent, setSavingEvent] = useState(false);
	const [refreshingEvents, setRefreshingEvents] = useState(false);
	const [eventForm, setEventForm] = useState(emptyEventForm);
	const [editingEventId, setEditingEventId] = useState("");

	const selectedEvent = useMemo(
		() => events.find((event) => String(event._id || event.id) === String(selectedEventId)) || null,
		[events, selectedEventId],
	);

	const summaryText = currentUser?.name || currentUser?.email || "Admin";

	useEffect(() => {
		if (!isAdminSession()) {
			return undefined;
		}

		void loadAdminDashboardData({
			setLoading,
			setDashboardError,
			setStats,
			setEngagement,
			setTopDestinations,
			setScheduledEvents,
			setMonthlyEngagement,
			setEvents,
			setSelectedEventId,
		});
	}, []);

	useEffect(() => {
		if (selectedEventId) {
			void loadAdminRsvps({ eventId: selectedEventId, setRsvps, setRsvpLoading, setDashboardError });
		}
	}, [selectedEventId]);

	if (!isAdminSession()) {
		return <Navigate to="/login" replace />;
	}

	const handleLogout = () => {
		logout();
		navigate("/login", { replace: true });
	};

	const handleRefreshDashboard = () => {
		void loadAdminDashboardData({
			setLoading,
			setDashboardError,
			setStats,
			setEngagement,
			setTopDestinations,
			setScheduledEvents,
			setMonthlyEngagement,
			setEvents,
			setSelectedEventId,
		});
	};

	const handleRsvpStatusChange = async (rsvpId, status) => {
		if (!rsvpId || !status) {
			return;
		}

		setEditingRsvpId(rsvpId);
		try {
			await adminAPI.updateRsvp(rsvpId, { status });
			await loadAdminRsvps({ eventId: selectedEventId, setRsvps, setRsvpLoading, setDashboardError });
		} catch (error) {
			setDashboardError(error.response?.data?.message || "Unable to update RSVP status.");
		} finally {
			setEditingRsvpId("");
		}
	};

	const handleDeleteRsvp = async (rsvpId) => {
		if (!rsvpId || !window.confirm("Delete this RSVP entry?")) {
			return;
		}

		setEditingRsvpId(rsvpId);
		try {
			await adminAPI.deleteRsvp(rsvpId);
			await loadAdminRsvps({ eventId: selectedEventId, setRsvps, setRsvpLoading, setDashboardError });
		} catch (error) {
			setDashboardError(error.response?.data?.message || "Unable to delete RSVP entry.");
		} finally {
			setEditingRsvpId("");
		}
	};

	const refreshEvents = async () => {
		setRefreshingEvents(true);
		try {
			const response = await adminAPI.getEvents();
			const nextEvents = toList(response.data);
			setEvents(nextEvents);
			if (nextEvents.length > 0) {
				setSelectedEventId((current) => current || String(nextEvents[0]._id || nextEvents[0].id));
			}
		} catch (error) {
			setDashboardError(error.response?.data?.message || "Unable to refresh events.");
		} finally {
			setRefreshingEvents(false);
		}
	};

	const handleEventSubmit = async (event) => {
		event.preventDefault();
		setSavingEvent(true);
		setDashboardError("");

		const payload = {
			title: eventForm.title,
			description: eventForm.description,
			date: eventForm.date,
			location: eventForm.location,
			category: eventForm.category,
			image: eventForm.image,
			status: eventForm.status,
		};

		try {
			if (editingEventId) {
				await adminAPI.updateEvent(editingEventId, payload);
			} else {
				await adminAPI.createEvent(payload);
			}

			setEventForm(emptyEventForm);
			setEditingEventId("");
			await refreshEvents();
		} catch (error) {
			setDashboardError(error.response?.data?.message || "Unable to save the event.");
		} finally {
			setSavingEvent(false);
		}
	};

	const beginEditEvent = (eventData) => {
		setEditingEventId(String(eventData._id || eventData.id));
		setEventForm({
			title: eventData.title || "",
			description: eventData.description || "",
			date: eventData.date ? String(eventData.date).slice(0, 16) : "",
			location: eventData.location || "",
			category: eventData.category || "",
			image: eventData.image || "",
			status: eventData.status || "scheduled",
		});
	};

	const handleDeleteEvent = async (eventId) => {
		if (!eventId || !window.confirm("Delete this event?")) {
			return;
		}

		setSavingEvent(true);
		try {
			await adminAPI.deleteEvent(eventId);
			setEditingEventId((current) => (current === String(eventId) ? "" : current));
			if (String(selectedEventId) === String(eventId)) {
				setSelectedEventId("");
			}
			await refreshEvents();
		} catch (error) {
			setDashboardError(error.response?.data?.message || "Unable to delete the event.");
		} finally {
			setSavingEvent(false);
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-[#effaf2] text-slate-900">
			<div className="blob one floaty" />
			<div className="blob two floaty" />

			<div className="mx-auto grid min-h-screen max-w-400 gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
				<aside className="rounded-4xl border border-emerald-100 bg-white/90 p-5 shadow-2xl shadow-emerald-100/60 backdrop-blur-xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
					<div className="flex h-full flex-col gap-6">
						<Link to="/admin" className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-teal-500 text-lg font-black text-white shadow-lg shadow-emerald-200">E</div>
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Eventify</p>
								<p className="text-lg font-extrabold text-slate-900">Admin Dashboard</p>
							</div>
						</Link>

						<div className="rounded-[1.6rem] bg-emerald-50 p-4">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Signed in as</p>
							<p className="mt-2 text-base font-bold text-slate-900">{summaryText}</p>
							<p className="text-sm text-slate-500">Full admin access enabled</p>
						</div>

						<nav className="flex flex-1 flex-col gap-2 text-sm font-semibold text-slate-700">
							<a href="#overview" className="rounded-2xl px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700">Overview</a>
							<a href="#analytics" className="rounded-2xl px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700">Analytics</a>
							<a href="#events" className="rounded-2xl px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700">Events</a>
							<a href="#rsvps" className="rounded-2xl px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700">RSVPs</a>
							<a href="#event-editor" className="rounded-2xl px-4 py-3 transition hover:bg-emerald-50 hover:text-emerald-700">Event Editor</a>
						</nav>

						<div className="space-y-3 border-t border-emerald-100 pt-4">
							<button type="button" onClick={handleLogout} className="w-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl">
								Logout
							</button>
							<p className="text-xs leading-5 text-slate-500">Admin access is handled entirely on the frontend for this dashboard session.</p>
						</div>
					</div>
				</aside>

				<main className="space-y-6">
					<header className="rounded-4xl border border-emerald-100 bg-white/90 px-5 py-5 shadow-xl shadow-emerald-100/50 backdrop-blur-xl md:px-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Control center</p>
								<h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">Admin Dashboard</h1>
								<p className="mt-2 max-w-2xl text-sm text-slate-500">Monitor live engagement, review RSVPs, and manage events using the same polished visual language as the public site.</p>
							</div>
							<div className="flex flex-wrap gap-3">
								<button type="button" onClick={handleRefreshDashboard} className="rounded-full border border-emerald-100 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50">Refresh data</button>
								<button type="button" onClick={handleLogout} className="rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5">Logout</button>
							</div>
						</div>
					</header>

					{dashboardError ? (
						<div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
							{dashboardError}
						</div>
					) : null}

					<section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
						{(loading ? statBlueprints : stats).map((stat) => (
							<StatCard key={stat.label} stat={stat} />
						))}
					</section>

					<section id="analytics" className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
						<SectionCard title="Like, Comment, Share" subtitle="Real engagement values from the admin analytics endpoint.">
							<MiniBars items={engagement.length > 0 ? engagement : [{ label: "Like", value: 0 }, { label: "Comment", value: 0 }, { label: "Share", value: 0 }]} />
						</SectionCard>

						<SectionCard title="Top Destinations" subtitle="Locations driving the strongest activity.">
							<div className="space-y-4">
								{topDestinations.length > 0 ? topDestinations.map((item, index) => {
									const maxValue = Math.max(...topDestinations.map((entry) => entry.value), 1);
									const percent = Math.max((item.value / maxValue) * 100, 8);
									return (
										<div key={`${item.label}-${index}`} className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
											<div className="flex items-center justify-between gap-3">
												<div>
													<p className="font-semibold text-slate-900">{item.label}</p>
													<p className="text-xs text-slate-500">{item.meta || "Destination data"}</p>
												</div>
												<p className="text-sm font-bold text-emerald-700">{formatNumber(item.value)}</p>
											</div>
										<div className="h-2 rounded-full bg-emerald-100">
											<div className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500" style={{ width: `${percent}%` }} />
										</div>
									</div>
								);
								}) : <p className="text-sm text-slate-500">No destination data yet.</p>}
							</div>
						</SectionCard>
					</section>

					<section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
						<SectionCard title="Scheduled Ads / Events" subtitle="Planned content pulled from the backend schedule endpoint.">
							<div className="space-y-3">
								{scheduledEvents.length > 0 ? scheduledEvents.map((item, index) => (
									<div key={`${item.label}-${index}`} className="rounded-2xl border border-emerald-100 bg-white p-4">
										<div className="flex items-center justify-between gap-3">
											<div>
												<p className="font-semibold text-slate-900">{item.label}</p>
												<p className="text-xs text-slate-500">{item.meta || "Scheduled item"}</p>
											</div>
											<div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{formatNumber(item.value)}</div>
										</div>
									</div>
								)) : <p className="text-sm text-slate-500">No scheduled items returned yet.</p>}
							</div>
						</SectionCard>

						<SectionCard title="Engagement & Downloads" subtitle="Monthly totals from the backend analytics feed.">
							<div className="space-y-4">
								{monthlyEngagement.length > 0 ? monthlyEngagement.map((item) => (
									<div key={item.label} className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<p className="font-semibold text-slate-900">{item.label}</p>
											<p className="text-slate-500">{formatNumber(item.value)}</p>
										</div>
										<div className="h-3 rounded-full bg-emerald-100">
											<div className="h-full rounded-full bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-400" style={{ width: `${Math.max((item.value / Math.max(...monthlyEngagement.map((entry) => entry.value), 1)) * 100, 8)}%` }} />
										</div>
									</div>
								)) : <p className="text-sm text-slate-500">No monthly analytics data yet.</p>}
							</div>
						</SectionCard>
					</section>

					<section id="events" className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
						<SectionCard
							title="All Events"
							subtitle="Review every event created through the public app and manage them from here."
							action={
								<button type="button" onClick={refreshEvents} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
									{refreshingEvents ? "Refreshing..." : "Refresh events"}
								</button>
							}
						>
							<div className="grid gap-3 md:grid-cols-2">
								{events.length > 0 ? events.map((event) => {
									const eventId = String(event._id || event.id);
									const isSelected = eventId === String(selectedEventId);
									return (
										<button key={eventId} type="button" onClick={() => setSelectedEventId(eventId)} className={`rounded-3xl border p-4 text-left transition ${isSelected ? "border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-100" : "border-emerald-100 bg-white hover:bg-emerald-50/60"}`}>
											<p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{event.category || event.status || "Event"}</p>
											<h3 className="mt-2 font-bold text-slate-900">{event.title || "Untitled event"}</h3>
											<p className="mt-1 text-sm text-slate-500">{event.location || "No location provided"}</p>
										</button>
									);
								}) : <p className="text-sm text-slate-500">No events returned yet.</p>}
							</div>
						</SectionCard>

						<SectionCard title="Selected Event" subtitle="Context for the RSVP table on the right.">
							{selectedEvent ? (
								<div className="space-y-4 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Current selection</p>
										<h3 className="mt-2 text-2xl font-black text-slate-900">{selectedEvent.title || "Untitled event"}</h3>
									</div>
									<div className="grid gap-3 text-sm text-slate-600">
										<p><span className="font-semibold text-slate-900">Date:</span> {formatDateTime(selectedEvent.date)}</p>
										<p><span className="font-semibold text-slate-900">Location:</span> {selectedEvent.location || "—"}</p>
										<p><span className="font-semibold text-slate-900">Category:</span> {selectedEvent.category || "—"}</p>
										<p><span className="font-semibold text-slate-900">Status:</span> {selectedEvent.status || "—"}</p>
									</div>
									<div className="flex gap-3">
										<button type="button" onClick={() => beginEditEvent(selectedEvent)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50">Edit</button>
										<button type="button" onClick={() => handleDeleteEvent(String(selectedEvent._id || selectedEvent.id))} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">Delete</button>
									</div>
								</div>
							) : (
								<p className="text-sm text-slate-500">Pick an event to manage its RSVPs.</p>
							)}
						</SectionCard>
					</section>

					<SectionCard id="rsvps" title="RSVP Management" subtitle="View, update, and delete RSVP records for the selected event.">
						<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
								<span>Choose event</span>
								<select value={selectedEventId} onChange={(event) => setSelectedEventId(event.target.value)} className="min-w-72 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500">
									<option value="">Select an event</option>
									{events.map((event) => (
										<option key={String(event._id || event.id)} value={String(event._id || event.id)}>
											{event.title || "Untitled event"}
										</option>
									))}
								</select>
							</label>
							<div className="text-sm text-slate-500">{rsvpLoading ? "Loading RSVPs..." : `${rsvps.length} RSVP records`}</div>
						</div>

						<div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
									<thead className="bg-emerald-50/80 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
										<tr>
											<th className="px-4 py-3">Name</th>
											<th className="px-4 py-3">Email</th>
											<th className="px-4 py-3">Status</th>
											<th className="px-4 py-3">RSVP Date</th>
											<th className="px-4 py-3">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-emerald-50 bg-white">
										{rsvps.length > 0 ? rsvps.map((rsvp) => {
											const rsvpId = String(rsvp._id || rsvp.id);
											const currentStatus = String(rsvp.status || "").toLowerCase();
											return (
												<tr key={rsvpId} className="align-top">
													<td className="px-4 py-4 font-medium text-slate-900">{rsvp.name || rsvp.user?.name || "Anonymous"}</td>
													<td className="px-4 py-4 text-slate-600">{rsvp.email || rsvp.user?.email || "—"}</td>
													<td className="px-4 py-4">
														<select value={currentStatus} onChange={(event) => handleRsvpStatusChange(rsvpId, event.target.value)} disabled={editingRsvpId === rsvpId} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold capitalize text-emerald-700 outline-none transition focus:border-emerald-500 disabled:opacity-60">
															{rsvpStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
														</select>
													</td>
													<td className="px-4 py-4 text-slate-600">{formatDateTime(rsvp.createdAt || rsvp.rsvpDate || rsvp.updatedAt)}</td>
													<td className="px-4 py-4">
														<button type="button" onClick={() => handleDeleteRsvp(rsvpId)} disabled={editingRsvpId === rsvpId} className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60">
															Delete
														</button>
													</td>
												</tr>
											);
										}) : (
											<tr>
												<td colSpan="5" className="px-4 py-8 text-center text-slate-500">No RSVP entries available for the selected event.</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</SectionCard>

					<SectionCard id="event-editor" title={editingEventId ? "Edit Event" : "Create Event"} subtitle="Optional event management tools that match the existing dashboard styling.">
						<form onSubmit={handleEventSubmit} className="grid gap-4 md:grid-cols-2">
							<div className="md:col-span-2">
								<label className="block text-sm font-semibold text-slate-700">
									Title
									<input type="text" value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none transition focus:border-emerald-500" placeholder="Event title" />
								</label>
							</div>

							<div className="md:col-span-2">
								<label className="block text-sm font-semibold text-slate-700">
									Description
									<textarea value={eventForm.description} onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 min-h-32 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none transition focus:border-emerald-500" placeholder="Brief event description" />
								</label>
							</div>

							<label className="block text-sm font-semibold text-slate-700">
								Date
								<input type="datetime-local" value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none transition focus:border-emerald-500" />
							</label>

							<label className="block text-sm font-semibold text-slate-700">
								Location
								<input type="text" value={eventForm.location} onChange={(event) => setEventForm((current) => ({ ...current, location: event.target.value }))} className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none transition focus:border-emerald-500" placeholder="City or venue" />
							</label>

							<label className="block text-sm font-semibold text-slate-700">
								Category
								<input type="text" value={eventForm.category} onChange={(event) => setEventForm((current) => ({ ...current, category: event.target.value }))} className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none transition focus:border-emerald-500" placeholder="Conference, meetup, contest" />
							</label>

							<label className="block text-sm font-semibold text-slate-700">
								Image URL
								<input type="url" value={eventForm.image} onChange={(event) => setEventForm((current) => ({ ...current, image: event.target.value }))} className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none transition focus:border-emerald-500" placeholder="https://..." />
							</label>

							<label className="block text-sm font-semibold text-slate-700">
								Status
								<select value={eventForm.status} onChange={(event) => setEventForm((current) => ({ ...current, status: event.target.value }))} className="mt-2 w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 outline-none transition focus:border-emerald-500">
									<option value="scheduled">Scheduled</option>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
								</select>
							</label>

							<div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
								<button type="submit" disabled={savingEvent} className="rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 disabled:opacity-60">
									{editingEventId ? "Update Event" : "Create Event"}
								</button>
								<button type="button" onClick={() => { setEditingEventId(""); setEventForm(emptyEventForm); }} className="rounded-full border border-emerald-100 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
									Reset
								</button>
								{editingEventId ? <span className="self-center text-sm text-slate-500">Editing event {editingEventId}</span> : null}
							</div>
						</form>
					</SectionCard>
				</main>
			</div>
		</div>
	);
}