import mongoose from 'mongoose';
import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

/**
 * Check attendee status
 */
const countsAsAttending = (status) =>
  status === 'going' || status === 'maybe';

/**
 * Sync attendee count with RSVP changes
 */
const syncAttendeeCount = async (
  eventId,
  previousStatus,
  nextStatus
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    return;
  }

  // Decrease attendee count
  if (
    countsAsAttending(previousStatus) &&
    !countsAsAttending(nextStatus)
  ) {
    event.attendees = Math.max(
      0,
      (event.attendees || 0) - 1
    );
  }

  // Increase attendee count
  if (
    !countsAsAttending(previousStatus) &&
    countsAsAttending(nextStatus)
  ) {
    event.attendees = (event.attendees || 0) + 1;
  }

  await event.save();
};

/**
 * CREATE OR UPDATE RSVP
 */
const upsertRsvp = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;

    const {
      name,
      email,
      status = 'going',
      guestCount = 1,
      comment = '',
    } = req.body;

    // Validate event ID
    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    // Find event
    const event = await Event.findById(eventId).select(
      '_id title description date location createdAt'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const normalizedStatus =
      String(status).toLowerCase();

    /**
     * Logged-in user RSVP
     */
    if (req.user?._id) {
      const existingRsvp =
        await RSVP.findOne({
          eventId,
          userId: req.user._id,
        });

      const previousStatus =
        existingRsvp?.status || null;

      const payload = {
        eventId,
        userId: req.user._id,
        name: req.user?.name || name,
        email: req.user?.email || email,
        status: normalizedStatus,
        guestCount,
        comment,
      };

      const rsvp =
        await RSVP.findOneAndUpdate(
          {
            eventId,
            userId: req.user._id,
          },
          payload,
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      await syncAttendeeCount(
        eventId,
        previousStatus,
        normalizedStatus
      );

      const populatedRsvp =
        await RSVP.findById(rsvp._id)
          .populate(
            'eventId',
            'title description date location createdAt'
          )
          .populate('userId', 'name email');

      return res
        .status(existingRsvp ? 200 : 201)
        .json({
          success: true,
          message: existingRsvp
            ? 'RSVP updated successfully'
            : 'RSVP created successfully',
          data: populatedRsvp,
        });
    }

    /**
     * Guest RSVP (without login)
     */
    const rsvp = await RSVP.create({
      eventId,
      name,
      email,
      status: normalizedStatus,
      guestCount,
      comment,
    });

    await syncAttendeeCount(
      eventId,
      null,
      normalizedStatus
    );

    const populatedRsvp =
      await RSVP.findById(rsvp._id).populate(
        'eventId',
        'title description date location createdAt'
      );

    return res.status(201).json({
      success: true,
      message: 'RSVP created successfully',
      data: populatedRsvp,
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
 * ADD RSVP
 */
export const addRsvp = upsertRsvp;

/**
 * UPDATE RSVP
 */
export const updateRsvp = upsertRsvp;

/**
 * REMOVE RSVP
 */
export const removeRsvp = async (
  req,
  res,
  next
) => {
  try {
    const { id: eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const existingRsvp =
      await RSVP.findOne({
        eventId,
        userId: req.user?._id,
      });

    if (!existingRsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found',
      });
    }

    await syncAttendeeCount(
      eventId,
      existingRsvp.status,
      null
    );

    await RSVP.deleteOne({
      _id: existingRsvp._id,
    });

    return res.status(200).json({
      success: true,
      message: 'RSVP removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET EVENT RSVPS
 */
export const getEventRsvps = async (
  req,
  res,
  next
) => {
  try {
    const { id: eventId } = req.params;
    const { status } = req.query;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(
      eventId
    ).select(
      '_id title description date location createdAt'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const filter = { eventId };

    if (status) {
      filter.status = status;
    }

    const rsvps = await RSVP.find(filter)
      .populate(
        'eventId',
        'title description date location createdAt'
      )
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      event,
      count: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET USER RSVPS
 */
export const getUserRsvps = async (
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
    })
      .populate('eventId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET RSVP STATUS
 */
export const getRsvpStatus = async (
  req,
  res,
  next
) => {
  try {
    const { id: eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const rsvp = await RSVP.findOne({
      eventId,
      userId: req.user?._id,
    });

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: rsvp,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET RSVP STATS
 */
export const getRsvpStats = async (
  req,
  res,
  next
) => {
  try {
    const { id: eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const stats = await RSVP.aggregate([
      {
        $match: {
          eventId:
            new mongoose.Types.ObjectId(
              eventId
            ),
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = stats.reduce(
      (accumulator, item) => {
        accumulator[item._id] =
          item.count;
        accumulator.total += item.count;
        return accumulator;
      },
      {
        going: 0,
        maybe: 0,
        decline: 0,
        total: 0,
      }
    );

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};