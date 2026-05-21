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
  getEventRsvps,
  getRsvpStats,
  getRsvpStatus,
  getUserRsvps,
  removeRsvp,
  updateRsvp,
} from '../controllers/rsvpController.js';

const router = express.Router();

router.get('/events/search', asyncHandler(getAllEvents));
router.get('/events/category', asyncHandler(getAllEvents));
router.get('/events', asyncHandler(getAllEvents));
router.get('/events/:id', asyncHandler(getEventById));
router.get('/users/:userId/events', asyncHandler(getUserEvents));
router.get('/users/:userId/joined-events', asyncHandler(getUserJoinedEvents));
router.get('/users/:userId/rsvps', asyncHandler(getUserRsvps));

router.post('/events/:id/comment', authMiddleware, asyncHandler(addComment));

router.post('/events', authMiddleware, asyncHandler(createEvent));
router.put('/events/:id', authMiddleware, asyncHandler(updateEvent));
router.delete('/events/:id', authMiddleware, asyncHandler(deleteEvent));

router.post('/events/:id/rsvp', authMiddleware, asyncHandler(addRsvp));
router.put('/events/:id/rsvp', authMiddleware, asyncHandler(updateRsvp));
router.delete('/events/:id/rsvp', authMiddleware, asyncHandler(removeRsvp));
router.get('/events/:id/rsvps', asyncHandler(getEventRsvps));
router.get('/events/:id/my-rsvp', authMiddleware, asyncHandler(getRsvpStatus));
router.get('/events/:id/rsvp-stats', asyncHandler(getRsvpStats));

export default router;