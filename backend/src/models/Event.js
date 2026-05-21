import mongoose from 'mongoose';

/**
 * Comment Schema
 */
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },

    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

/**
 * Event Schema
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      default: '',
    },

    date: {
      type: Date,
      required: [true, 'Date is required'],
    },

    time: {
      type: String,
      trim: true,
      default: '',
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: 'Business',
    },

    image: {
      type: String,
      default: '',
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    creator: {
      type: String,
      trim: true,
      default: 'Anonymous',
    },

    attendees: {
      type: Number,
      default: 0,
      min: [0, 'Attendees cannot be negative'],
    },

    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Optional Indexes for faster queries
 */
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ creatorId: 1 });
eventSchema.index({ date: 1 });

/**
 * Event Model
 */
const Event = mongoose.model(
  'Event',
  eventSchema
);

export default Event;