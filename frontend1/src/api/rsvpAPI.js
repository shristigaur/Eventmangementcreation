import axiosInstance from './axios.js';

const buildRsvpPayload = (data = {}) => ({
  status: data.status || 'going',
  guestCount: data.guestCount || 1,
  comment: data.comment || '',
  ...data,
});

// RSVP API endpoints
const rsvpAPI = {
  // Create RSVP (user joins/attends event)
  createRsvp: (eventId, data = {}) => {
    console.log('[RSVP API] createRsvp', { eventId, data });
    return axiosInstance.post(`/events/${eventId}/rsvp`, buildRsvpPayload(data));
  },

  // Update RSVP status
  updateRsvp: (eventId, data = {}) => {
    console.log('[RSVP API] updateRsvp', { eventId, data });
    return axiosInstance.put(`/events/${eventId}/rsvp`, buildRsvpPayload(data));
  },

  // Remove RSVP (user un-joins event)
  deleteRsvp: (eventId) => {
    console.log('[RSVP API] deleteRsvp', { eventId });
    return axiosInstance.delete(`/events/${eventId}/rsvp`);
  },

  // Get event RSVPs (guest list)
  getEventRsvps: (eventId, status = null) => {
    console.log('[RSVP API] getEventRsvps', { eventId, status });
    const params = status ? { status } : {};
    return axiosInstance.get(`/events/${eventId}/rsvps`, { params });
  },

  // Get user's RSVPs
  getUserRsvps: (userId) => {
    console.log('[RSVP API] getUserRsvps', { userId });
    return axiosInstance.get(`/users/${userId}/rsvps`);
  },

  // Get RSVP status for specific user and event
  getMyRsvp: (eventId) => {
    console.log('[RSVP API] getMyRsvp', { eventId });
    return axiosInstance.get(`/events/${eventId}/my-rsvp`);
  },

  // Get RSVP statistics for event
  getRsvpStats: (eventId) => {
    console.log('[RSVP API] getRsvpStats', { eventId });
    return axiosInstance.get(`/events/${eventId}/rsvp-stats`);
  },
};

rsvpAPI.addRsvp = rsvpAPI.createRsvp;
rsvpAPI.removeRsvp = rsvpAPI.deleteRsvp;
rsvpAPI.getRsvpStatus = rsvpAPI.getMyRsvp;

export default rsvpAPI;
