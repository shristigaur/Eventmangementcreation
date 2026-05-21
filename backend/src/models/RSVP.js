import mongoose from 'mongoose';

/**
 * RSVP Schema
 */
const rsvpSchema = new mongoose.Schema(
  {
    /**
     * Event Reference
     */
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },

    /**
     * User Reference (Optional for guest RSVP)
     */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },

    /**
     * Guest Name
     */
    name: {
      type: String,
      trim: true,
      default: '',
    },

    /**
     * Guest Email
     */
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },

    /**
     * RSVP Status
     */
    status: {
      type: String,
      enum: [
        'going',
        'maybe',
        'decline',
        'not going',
      ],
      default: 'going',

      set: (value) =>
        typeof value === 'string'
          ? value.toLowerCase()
          : value,
    },

    /**
     * Number of Guests
     */
    guestCount: {
      type: Number,
      default: 1,
      min: [1, 'Guest count must be at least 1'],
    },

    /**
     * Optional Comment
     */
    comment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Validation:
 * Require either:
 * - Logged in user
 * OR
 * - Guest name + email
 */
rsvpSchema.pre('validate', function (next) {
  if (
    !this.userId &&
    (!this.name || !this.email)
  ) {
    return next(
      new Error(
        'Guest RSVP requires name and email'
      )
    );
  }

  next();
});

/**
 * Unique RSVP per user/event
 * Only applies when userId exists
 */
rsvpSchema.index(
  {
    eventId: 1,
    userId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      userId: { $exists: true },
    },
  }
);

/**
 * Additional indexes
 */
rsvpSchema.index({ status: 1 });
rsvpSchema.index({ createdAt: -1 });

/**
 * RSVP Model
 */
const RSVP = mongoose.model(
  'RSVP',
  rsvpSchema
);

export default RSVP;