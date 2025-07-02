const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Gift name is required'],
    trim: true,
    maxlength: [100, 'Gift name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    required: [true, 'Price is required']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  link: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  image: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['planned', 'purchased', 'wrapped', 'delivered', 'received'],
    default: 'planned'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isDone: {
    type: Boolean,
    default: false
  },
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  purchasedAt: Date,
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  recipient: {
    name: String,
    relationship: String
  },
  shipping: {
    address: String,
    tracking: String,
    estimatedDelivery: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
giftSchema.index({ event: 1, status: 1 });
giftSchema.index({ user: 1, isDone: 1 });
giftSchema.index({ status: 1 });

module.exports = mongoose.model('Gift', giftSchema); 