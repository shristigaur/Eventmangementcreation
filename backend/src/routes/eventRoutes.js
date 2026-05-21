import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

import {
  addComment,
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getUserEvents,
  getUserJoinedEvents,
  updateEvent,
} from '../controllers/eventController.js';

import {
  addRsvp,
  updateRsvp,
  removeRsvp,
  getEventRsvps,
  getUserRsvps,
  getRsvpStatus,
  getRsvpStats,
} from '../controllers/rsvpController.js';

const router = express.Router();

/* ======================================================
   EVENT ROUTES
====================================================== */

/**
 * Search / Filter Events
 */
router.get(
  '/events/search',
  asyncHandler(getAllEvents)
);

router.get(
  '/events/category',
  asyncHandler(getAllEvents)
);

/**
 * Get All Events
 */
router.get(
  '/events',
  asyncHandler(getAllEvents)
);

/**
 * Get Single Event
 */
router.get(
  '/events/:id',
  asyncHandler(getEventById)
);

/**
 * Create Event
 * Protected Route
 */
router.post(
  '/events',
  authMiddleware,
  asyncHandler(createEvent)
);

/**
 * Update Event
 * Protected Route
 */
router.put(
  '/events/:id',
  authMiddleware,
  asyncHandler(updateEvent)
);

router.patch(
  '/events/:id',
  authMiddleware,
  asyncHandler(updateEvent)
);

/**
 * Delete Event
 * Protected Route
 */
router.delete(
  '/events/:id',
  authMiddleware,
  asyncHandler(deleteEvent)
);

/* ======================================================
   USER EVENT ROUTES
====================================================== */

/**
 * Get User Created Events
 */
router.get(
  '/users/:userId/events',
  asyncHandler(getUserEvents)
);

/**
 * Get User Joined Events
 */
router.get(
  '/users/:userId/joined-events',
  asyncHandler(getUserJoinedEvents)
);

/**
 * Get User RSVPs
 */
router.get(
  '/users/:userId/rsvps',
  asyncHandler(getUserRsvps)
);

/* ======================================================
   COMMENT ROUTES
====================================================== */

/**
 * Add Comment to Event
 * Protected Route
 */
router.post(
  '/events/:id/comment',
  authMiddleware,
  asyncHandler(addComment)
);

/* ======================================================
   RSVP ROUTES
====================================================== */

/**
 * Add RSVP
 * Protected Route
 */
router.post(
  '/events/:id/rsvp',
  authMiddleware,
  asyncHandler(addRsvp)
);

/**
 * Update RSVP
 * Protected Route
 */
router.put(
  '/events/:id/rsvp',
  authMiddleware,
  asyncHandler(updateRsvp)
);

/**
 * Remove RSVP
 * Protected Route
 */
router.delete(
  '/events/:id/rsvp',
  authMiddleware,
  asyncHandler(removeRsvp)
);

/**
 * Get All Event RSVPs
 */
router.get(
  '/events/:id/rsvps',
  asyncHandler(getEventRsvps)
);

/**
 * Get Logged-in User RSVP Status
 * Protected Route
 */
router.get(
  '/events/:id/my-rsvp',
  authMiddleware,
  asyncHandler(getRsvpStatus)
);

/**
 * Get RSVP Statistics
 */
router.get(
  '/events/:id/rsvp-stats',
  asyncHandler(getRsvpStats)
);

export default router;