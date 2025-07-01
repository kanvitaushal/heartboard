const express = require('express');
const Event = require('../models/Event');
const Gift = require('../models/Gift');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all events for user
// @route   GET /api/events
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, search, sort = 'date' } = req.query;
    
    // Build query
    let query = { user: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortObj = {};
    if (sort === 'date') sortObj.date = 1;
    else if (sort === 'name') sortObj.name = 1;
    else if (sort === 'created') sortObj.createdAt = -1;

    const events = await Event.find(query)
      .sort(sortObj)
      .populate('gifts', 'name price isDone')
      .lean();

    // Add gift statistics to each event
    const eventsWithStats = events.map(event => {
      const totalGifts = event.gifts ? event.gifts.length : 0;
      const completedGifts = event.gifts ? event.gifts.filter(gift => gift.isDone).length : 0;
      const totalSpent = event.gifts ? event.gifts.reduce((sum, gift) => sum + (gift.price || 0), 0) : 0;

      return {
        ...event,
        giftStats: {
          total: totalGifts,
          completed: completedGifts,
          pending: totalGifts - completedGifts,
          totalSpent
        }
      };
    });

    res.json({
      success: true,
      count: eventsWithStats.length,
      data: eventsWithStats
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      error: 'Failed to get events',
      message: error.message
    });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('gifts')
      .populate('sharedWith.user', 'name email avatar');

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'Event not found'
      });
    }

    // Check if user owns the event or is shared with
    const isOwner = event.user.toString() === req.user._id.toString();
    const isShared = event.sharedWith.some(share => 
      share.user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this event'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      error: 'Failed to get event',
      message: error.message
    });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      date,
      description,
      category,
      budget,
      location,
      tags,
      isPublic
    } = req.body;

    const event = await Event.create({
      user: req.user._id,
      name,
      date,
      description,
      category,
      budget,
      location,
      tags,
      isPublic
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      error: 'Failed to create event',
      message: error.message
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own events'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      error: 'Failed to update event',
      message: error.message
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own events'
      });
    }

    // Delete associated gifts
    await Gift.deleteMany({ event: req.params.id });

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      error: 'Failed to delete event',
      message: error.message
    });
  }
});

// @desc    Share event with user
// @route   POST /api/events/:id/share
// @access  Private
router.post('/:id/share', protect, async (req, res) => {
  try {
    const { email, role = 'viewer' } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only share your own events'
      });
    }

    // Find user by email
    const User = require('../models/User');
    const userToShare = await User.findOne({ email });

    if (!userToShare) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with this email not found'
      });
    }

    // Check if already shared
    const alreadyShared = event.sharedWith.find(share => 
      share.user.toString() === userToShare._id.toString()
    );

    if (alreadyShared) {
      return res.status(400).json({
        error: 'Already shared',
        message: 'Event is already shared with this user'
      });
    }

    // Add to sharedWith array
    event.sharedWith.push({
      user: userToShare._id,
      role
    });

    await event.save();

    res.json({
      success: true,
      message: 'Event shared successfully',
      data: event
    });
  } catch (error) {
    console.error('Share event error:', error);
    res.status(500).json({
      error: 'Failed to share event',
      message: error.message
    });
  }
});

module.exports = router; 