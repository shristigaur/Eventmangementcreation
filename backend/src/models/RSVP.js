import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['going', 'maybe', 'decline'],
      default: 'going',
    },
    guestCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

rsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const RSVP = mongoose.model('RSVP', rsvpSchema);

export default RSVP;