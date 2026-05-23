import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import authMiddleware from '../middleware/authMiddleware.js';

import {
  getStats,
  getEngagement,
  getTopDestinations,
  getScheduledEvents,
  getMonthlyEngagement,
  getEvents,
  getEventRsvps,
  updateRsvp,
  deleteRsvp,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/admin/stats', asyncHandler(getStats));
router.get('/admin/engagement', asyncHandler(getEngagement));
router.get('/admin/top-destinations', asyncHandler(getTopDestinations));
router.get('/admin/scheduled-events', asyncHandler(getScheduledEvents));
router.get('/admin/monthly-engagement', asyncHandler(getMonthlyEngagement));

router.get('/admin/events', asyncHandler(getEvents));
router.get('/admin/events/:eventId/rsvp', asyncHandler(getEventRsvps));

// Protect mutating admin routes with authMiddleware (optional)
router.put('/admin/rsvp/:rsvpId', authMiddleware, asyncHandler(updateRsvp));
router.delete('/admin/rsvp/:rsvpId', authMiddleware, asyncHandler(deleteRsvp));

export default router;
