const mongoose = require('mongoose');
const Event = require('../models/Event');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
    });

    return res.status(201).json({
      message: 'Event created successfully',
      data: event,
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

const getAllEvents = async (_req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, createdAt: -1 });

    return res.status(200).json({
      count: events.length,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid event ID',
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid event ID',
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      message: 'Event updated successfully',
      data: updatedEvent,
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

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid event ID',
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};