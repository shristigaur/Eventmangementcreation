const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['going', 'not going'],
      default: 'going',
      set: (value) => (typeof value === 'string' ? value.toLowerCase() : value),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RSVP', rsvpSchema);