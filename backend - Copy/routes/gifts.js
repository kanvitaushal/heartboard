const express = require('express');
const Gift = require('../models/Gift');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all gifts for an event
// @route   GET /api/gifts/event/:eventId
// @access  Private
router.get('/event/:eventId', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'Event not found'
      });
    }

    // Check permissions
    const isOwner = event.user.toString() === req.user._id.toString();
    const isShared = event.sharedWith.some(share => 
      share.user.toString() === req.user._id.toString()
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this event'
      });
    }

    const gifts = await Gift.find({ event: req.params.eventId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: gifts.length,
      data: gifts
    });
  } catch (error) {
    console.error('Get gifts error:', error);
    res.status(500).json({
      error: 'Failed to get gifts',
      message: error.message
    });
  }
});

// @desc    Create new gift
// @route   POST /api/gifts
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      eventId,
      name,
      description,
      price,
      currency,
      link,
      priority,
      notes,
      tags,
      recipient
    } = req.body;

    // Verify event exists and user has access
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: 'Event not found'
      });
    }

    const isOwner = event.user.toString() === req.user._id.toString();
    const isShared = event.sharedWith.some(share => 
      share.user.toString() === req.user._id.toString() && share.role !== 'viewer'
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to add gifts to this event'
      });
    }

    const gift = await Gift.create({
      event: eventId,
      user: req.user._id,
      name,
      description,
      price,
      currency,
      link,
      priority,
      notes,
      tags,
      recipient
    });

    res.status(201).json({
      success: true,
      message: 'Gift added successfully',
      data: gift
    });
  } catch (error) {
    console.error('Create gift error:', error);
    res.status(500).json({
      error: 'Failed to create gift',
      message: error.message
    });
  }
});

// @desc    Update gift
// @route   PUT /api/gifts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    
    if (!gift) {
      return res.status(404).json({
        error: 'Gift not found',
        message: 'Gift not found'
      });
    }

    // Check permissions
    const event = await Event.findById(gift.event);
    const isOwner = event.user.toString() === req.user._id.toString();
    const isShared = event.sharedWith.some(share => 
      share.user.toString() === req.user._id.toString() && share.role !== 'viewer'
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to update this gift'
      });
    }

    const updatedGift = await Gift.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Gift updated successfully',
      data: updatedGift
    });
  } catch (error) {
    console.error('Update gift error:', error);
    res.status(500).json({
      error: 'Failed to update gift',
      message: error.message
    });
  }
});

// @desc    Delete gift
// @route   DELETE /api/gifts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    
    if (!gift) {
      return res.status(404).json({
        error: 'Gift not found',
        message: 'Gift not found'
      });
    }

    // Check permissions
    const event = await Event.findById(gift.event);
    const isOwner = event.user.toString() === req.user._id.toString();
    const isShared = event.sharedWith.some(share => 
      share.user.toString() === req.user._id.toString() && share.role === 'admin'
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to delete this gift'
      });
    }

    await Gift.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gift deleted successfully'
    });
  } catch (error) {
    console.error('Delete gift error:', error);
    res.status(500).json({
      error: 'Failed to delete gift',
      message: error.message
    });
  }
});

// @desc    Toggle gift completion status
// @route   PATCH /api/gifts/:id/toggle
// @access  Private
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    
    if (!gift) {
      return res.status(404).json({
        error: 'Gift not found',
        message: 'Gift not found'
      });
    }

    // Check permissions
    const event = await Event.findById(gift.event);
    const isOwner = event.user.toString() === req.user._id.toString();
    const isShared = event.sharedWith.some(share => 
      share.user.toString() === req.user._id.toString() && share.role !== 'viewer'
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to update this gift'
      });
    }

    gift.isDone = !gift.isDone;
    if (gift.isDone) {
      gift.purchasedBy = req.user._id;
      gift.purchasedAt = new Date();
    } else {
      gift.purchasedBy = null;
      gift.purchasedAt = null;
    }

    await gift.save();

    res.json({
      success: true,
      message: `Gift marked as ${gift.isDone ? 'completed' : 'pending'}`,
      data: gift
    });
  } catch (error) {
    console.error('Toggle gift error:', error);
    res.status(500).json({
      error: 'Failed to toggle gift status',
      message: error.message
    });
  }
});

module.exports = router; 