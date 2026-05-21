import mongoose from 'mongoose';
import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80';

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

/**
 * Get database attendee counts
 */
const enrichAttendees = async (events) => {
  const eventList = Array.isArray(events) ? events : [events];

  if (!eventList.length || !eventList[0]) {
    return [];
  }

  const rsvpCounts = await RSVP.aggregate([
    {
      $match: {
        eventId: {
          $in: eventList.map((event) => event._id),
        },
        status: { $in: ['going', 'maybe'] },
      },
    },
    {
      $group: {
        _id: '$eventId',
        total: { $sum: 1 },
      },
    },
  ]);

  const countMap = new Map(
    rsvpCounts.map((item) => [
      item._id.toString(),
      item.total,
    ])
  );

  return eventList.map((event) => ({
    ...event.toObject(),
    attendees:
      countMap.get(event._id.toString()) ||
      event.attendees ||
      0,
  }));
};

/**
 * CREATE EVENT
 */
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image,
    } = req.body;

    // Validation
    if (!title || !description || !date || !location) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide title, description, date, and location',
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date,
      time: time?.trim() || '',
      location: location.trim(),
      category: category || 'General',
      image: image || DEFAULT_IMAGE,
      creatorId: req.user?._id,
      creator: req.user?.name || 'Anonymous',
      attendees: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message,
      });
    }

    next(error);
  }
};

/**
 * GET ALL EVENTS
 */
export const getAllEvents = async (req, res, next) => {
  try {
    const { q, category, creatorId } = req.query;

    const filter = {};

    // Search filter
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Creator filter
    if (creatorId && isValidObjectId(creatorId)) {
      filter.creatorId = creatorId;
    }

    const events = await Event.find(filter).sort({
      date: 1,
      createdAt: -1,
    });

    const enrichedEvents =
      await enrichAttendees(events);

    return res.status(200).json({
      success: true,
      count: enrichedEvents.length,
      data: enrichedEvents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET EVENT BY ID
 */
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const [enrichedEvent] =
      await enrichAttendees(event);

    return res.status(200).json({
      success: true,
      data: enrichedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE EVENT
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const existingEvent =
      await Event.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Authorization check
    if (
      existingEvent.creatorId &&
      req.user?._id &&
      existingEvent.creatorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not allowed to update this event',
      });
    }

    const updatedEvent =
      await Event.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    const [enrichedEvent] =
      await enrichAttendees(updatedEvent);

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: enrichedEvent,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message,
      });
    }

    next(error);
  }
};

/**
 * DELETE EVENT
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const existingEvent =
      await Event.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Authorization check
    if (
      existingEvent.creatorId &&
      req.user?._id &&
      existingEvent.creatorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'You are not allowed to delete this event',
      });
    }

    // Delete related RSVPs
    await RSVP.deleteMany({ eventId: id });

    // Delete event
    await Event.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET USER CREATED EVENTS
 */
export const getUserEvents = async (
  req,
  res,
  next
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const events = await Event.find({
      creatorId: userId,
    }).sort({
      date: 1,
      createdAt: -1,
    });

    const enrichedEvents =
      await enrichAttendees(events);

    return res.status(200).json({
      success: true,
      count: enrichedEvents.length,
      data: enrichedEvents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET USER JOINED EVENTS
 */
export const getUserJoinedEvents = async (
  req,
  res,
  next
) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const rsvps = await RSVP.find({
      userId,
      status: { $in: ['going', 'maybe'] },
    })
      .populate('eventId')
      .sort({ createdAt: -1 });

    const events = rsvps
      .map((rsvp) => rsvp.eventId)
      .filter(Boolean);

    const enrichedEvents =
      await enrichAttendees(events);

    return res.status(200).json({
      success: true,
      count: enrichedEvents.length,
      data: enrichedEvents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADD COMMENT
 */
export const addComment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const comment = {
      userId: req.user?._id,
      author: req.user?.name || 'Anonymous',
      text: text.trim(),
      createdAt: new Date(),
    };

    // Atomic update
    await Event.findByIdAndUpdate(id, {
      $push: { comments: comment },
    });

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};