const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'shared'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['birthday', 'anniversary', 'wedding', 'graduation', 'holiday', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    }
  }],
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative']
  },
  location: {
    type: String,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    public_id: String,
    url: String,
    type: {
      type: String,
      enum: ['image', 'document', 'other']
    }
  }]
}, {
  timestamps: true
});

// Virtual for total budget spent
eventSchema.virtual('totalSpent').get(function() {
  return this.gifts ? this.gifts.reduce((sum, gift) => sum + (gift.price || 0), 0) : 0;
});

// Index for better query performance
eventSchema.index({ user: 1, date: -1 });
eventSchema.index({ status: 1 });
eventSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Event', eventSchema); 