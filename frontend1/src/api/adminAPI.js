import axios from "axios";
import { getApiBaseUrl } from "../utils/backendUrl.js";

const adminClient = axios.create({
	baseURL: getApiBaseUrl(),
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

const adminAPI = {
	getStats: () => adminClient.get("/admin/stats"),
	getEngagement: () => adminClient.get("/admin/engagement"),
	getTopDestinations: () => adminClient.get("/admin/top-destinations"),
	getScheduledEvents: () => adminClient.get("/admin/scheduled-events"),
	getMonthlyEngagement: () => adminClient.get("/admin/monthly-engagement"),
	getEvents: () => adminClient.get("/admin/events"),
	getEventRsvps: (eventId) => adminClient.get(`/admin/events/${eventId}/rsvp`),
	updateRsvp: (rsvpId, payload) => adminClient.put(`/admin/rsvp/${rsvpId}`, payload),
	deleteRsvp: (rsvpId) => adminClient.delete(`/admin/rsvp/${rsvpId}`),
	createEvent: (payload) => adminClient.post("/admin/events", payload),
	updateEvent: (eventId, payload) => adminClient.put(`/admin/events/${eventId}`, payload),
	deleteEvent: (eventId) => adminClient.delete(`/admin/events/${eventId}`),
};

export default adminAPI;