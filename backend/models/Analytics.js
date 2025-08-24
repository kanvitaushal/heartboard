const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['login', 'register', 'demo_login', 'logout', 'page_view']
  },
  userId: {
    type: String,
    required: false // Can be null for demo users
  },
  userEmail: {
    type: String,
    required: false
  },
  userType: {
    type: String,
    enum: ['demo', 'registered'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  ipAddress: String,
  page: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ userType: 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
