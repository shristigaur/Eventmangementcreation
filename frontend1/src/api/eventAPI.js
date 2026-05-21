import axiosInstance from './axios.js';

// Event API endpoints
const eventAPI = {
  // Get all events (with optional filters)
  getAllEvents: (filters = {}) => {
    return axiosInstance.get('/events', { params: filters });
  },

  // Get event by ID
  getEventById: (eventId) => {
    return axiosInstance.get(`/events/${eventId}`);
  },

  // Create a new event
  createEvent: (eventData) => {
    return axiosInstance.post('/events', eventData);
  },

  // Update event (PUT - full update)
  updateEvent: (eventId, eventData) => {
    return axiosInstance.put(`/events/${eventId}`, eventData);
  },

  // Partial update event (PATCH)
  patchEvent: (eventId, updateData) => {
    return axiosInstance.patch(`/events/${eventId}`, updateData);
  },

  // Delete event
  deleteEvent: (eventId) => {
    return axiosInstance.delete(`/events/${eventId}`);
  },

  // Get user's created events
  getUserEvents: (userId) => {
    return axiosInstance.get(`/users/${userId}/events`);
  },

  // Get user's joined/RSVP'd events
  getUserJoinedEvents: (userId) => {
    return axiosInstance.get(`/users/${userId}/joined-events`);
  },

  // Search events
  searchEvents: (query) => {
    return axiosInstance.get('/events/search', { params: { q: query } });
  },

  // Get events by category
  getEventsByCategory: (category) => {
    return axiosInstance.get('/events/category', { params: { category } });
  },

  // Add comment to an event
  addComment: (eventId, commentData) => {
    return axiosInstance.post(`/events/${eventId}/comment`, commentData);
  },
};

export default eventAPI;
