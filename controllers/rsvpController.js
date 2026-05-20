const mongoose = require('mongoose');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createRsvp = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const { name, email, status } = req.body;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(eventId).select('_id title description date location createdAt');

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    const rsvp = await RSVP.create({
      eventId,
      name,
      email,
      status,
    });

    const populatedRsvp = await RSVP.findById(rsvp._id).populate('eventId', 'title description date location createdAt');

    return res.status(201).json({
      message: 'RSVP created successfully',
      data: populatedRsvp,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        error: error.message,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getEventRsvps = async (req, res) => {
  try {
    const { id: eventId } = req.params;

    if (!isValidObjectId(eventId)) {
      return res.status(400).json({
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(eventId).select('_id title description date location createdAt');

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    const rsvps = await RSVP.find({ eventId }).populate('eventId', 'title description date location createdAt').sort({ createdAt: -1 });

    return res.status(200).json({
      event,
      count: rsvps.length,
      data: rsvps,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createRsvp,
  getEventRsvps,
};