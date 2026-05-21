import mongoose from 'mongoose';
import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const countsAsAttending = (status) => status === 'going' || status === 'maybe';

const syncAttendeeCount = async (eventId, previousStatus, nextStatus) => {
  const event = await Event.findById(eventId);

  if (!event) {
    return;
  }

  if (countsAsAttending(previousStatus) && !countsAsAttending(nextStatus)) {
    event.attendees = Math.max(0, (event.attendees || 0) - 1);
  }

  if (!countsAsAttending(previousStatus) && countsAsAttending(nextStatus)) {
    event.attendees = (event.attendees || 0) + 1;
  }

  await event.save();
};

const upsertRsvp = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const { status = 'going', guestCount = 1, comment = '' } = req.body;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const normalizedStatus = String(status).toLowerCase();
    const existingRsvp = await RSVP.findOne({ eventId, userId: req.user._id });
    const previousStatus = existingRsvp?.status || null;

    const payload = {
      eventId,
      userId: req.user._id,
      status: normalizedStatus,
      guestCount,
      comment,
    };

    const rsvp = await RSVP.findOneAndUpdate(
      { eventId, userId: req.user._id },
      payload,
      { new: true, upsert: true, runValidators: true }
    );

    await syncAttendeeCount(eventId, previousStatus, normalizedStatus);

    return res.status(existingRsvp ? 200 : 201).json(rsvp);
  } catch (error) {
    next(error);
  }
};

export const addRsvp = upsertRsvp;

export const updateRsvp = upsertRsvp;

export const removeRsvp = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const existingRsvp = await RSVP.findOne({ eventId, userId: req.user._id });

    if (!existingRsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found',
      });
    }

    await syncAttendeeCount(eventId, existingRsvp.status, null);
    await RSVP.deleteOne({ _id: existingRsvp._id });

    return res.status(200).json({
      success: true,
      message: 'RSVP removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getEventRsvps = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const { status } = req.query;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const filter = { eventId };

    if (status) {
      filter.status = status;
    }

    const rsvps = await RSVP.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });
    return res.status(200).json(rsvps);
  } catch (error) {
    next(error);
  }
};

export const getUserRsvps = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const rsvps = await RSVP.find({ userId }).populate('eventId').sort({ createdAt: -1 });
    return res.status(200).json(rsvps);
  } catch (error) {
    next(error);
  }
};

export const getRsvpStatus = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const rsvp = await RSVP.findOne({ eventId, userId: req.user._id });

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found',
      });
    }

    return res.status(200).json(rsvp);
  } catch (error) {
    next(error);
  }
};

export const getRsvpStats = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID',
      });
    }

    const stats = await RSVP.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = stats.reduce(
      (accumulator, item) => {
        accumulator[item._id] = item.count;
        accumulator.total += item.count;
        return accumulator;
      },
      { going: 0, maybe: 0, decline: 0, total: 0 }
    );

    return res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};