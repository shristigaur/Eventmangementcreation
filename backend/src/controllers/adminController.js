import User from '../models/User.js';
import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';

/**
 * GET /admin/stats
 * Return high level counts for dashboard
 */
export const getStats = async (req, res) => {
  const [userCount, eventCount, rsvpCount] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    RSVP.countDocuments(),
  ]);

  return res.json({
    success: true,
    data: {
      users: userCount,
      events: eventCount,
      rsvps: rsvpCount,
    },
  });
};

/**
 * GET /admin/engagement
 * Return RSVP status breakdown
 */
export const getEngagement = async (req, res) => {
  const stats = await RSVP.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return res.json({ success: true, data: stats });
};

/**
 * GET /admin/top-destinations
 * Return top event locations by number of events
 */
export const getTopDestinations = async (req, res) => {
  const results = await Event.aggregate([
    { $group: { _id: '$location', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return res.json({ success: true, data: results });
};

/**
 * GET /admin/scheduled-events
 * Upcoming events
 */
export const getScheduledEvents = async (req, res) => {
  const now = new Date();
  const events = await Event.find({ date: { $gte: now } }).sort({ date: 1 }).limit(50);
  return res.json({ success: true, data: events });
};

/**
 * GET /admin/monthly-engagement
 * RSVPs per month (last 6 months)
 */
export const getMonthlyEngagement = async (req, res) => {
  const monthsBack = 6;
  const start = new Date();
  start.setMonth(start.getMonth() - monthsBack);

  const stats = await RSVP.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  return res.json({ success: true, data: stats });
};

/**
 * GET /admin/events
 */
export const getEvents = async (req, res) => {
  const events = await Event.find().sort({ date: -1 }).limit(200);
  return res.json({ success: true, data: events });
};

/**
 * GET /admin/events/:eventId/rsvp
 */
export const getEventRsvps = async (req, res) => {
  const { eventId } = req.params;
  const rsvps = await RSVP.find({ eventId }).sort({ createdAt: -1 }).limit(1000);
  return res.json({ success: true, data: rsvps });
};

/**
 * PUT /admin/rsvp/:rsvpId
 */
export const updateRsvp = async (req, res) => {
  const { rsvpId } = req.params;
  const payload = req.body || {};

  const updated = await RSVP.findByIdAndUpdate(rsvpId, payload, { new: true, runValidators: true });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'RSVP not found' });
  }

  return res.json({ success: true, data: updated });
};

/**
 * DELETE /admin/rsvp/:rsvpId
 */
export const deleteRsvp = async (req, res) => {
  const { rsvpId } = req.params;
  const removed = await RSVP.findByIdAndDelete(rsvpId);

  if (!removed) {
    return res.status(404).json({ success: false, message: 'RSVP not found' });
  }

  return res.json({ success: true, message: 'RSVP deleted' });
};

export default {
  getStats,
  getEngagement,
  getTopDestinations,
  getScheduledEvents,
  getMonthlyEngagement,
  getEvents,
  getEventRsvps,
  updateRsvp,
  deleteRsvp,
};
