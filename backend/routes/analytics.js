const express = require('express');
const Analytics = require('../models/Analytics');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Track an analytics event
// @route   POST /api/analytics/track
// @access  Public (for demo users)
router.post('/track', async (req, res) => {
  try {
    const { eventType, userId, userEmail, userType, page, metadata } = req.body;
    
    const analyticsData = {
      eventType,
      userId,
      userEmail,
      userType,
      page,
      metadata,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress
    };

    await Analytics.create(analyticsData);

    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      error: 'Failed to track event',
      message: error.message
    });
  }
});

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Public
router.get('/dashboard', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get total logins
    const totalLogins = await Analytics.countDocuments({
      eventType: { $in: ['login', 'demo_login'] },
      timestamp: { $gte: startDate }
    });

    // Get demo logins
    const demoLogins = await Analytics.countDocuments({
      eventType: 'demo_login',
      timestamp: { $gte: startDate }
    });

    // Get registered user logins
    const registeredLogins = await Analytics.countDocuments({
      eventType: 'login',
      timestamp: { $gte: startDate }
    });

    // Get unique users
    const uniqueUsers = await Analytics.distinct('userEmail', {
      eventType: { $in: ['login', 'demo_login'] },
      timestamp: { $gte: startDate },
      userEmail: { $ne: null }
    });

    // Get daily login trends
    const dailyLogins = await Analytics.aggregate([
      {
        $match: {
          eventType: { $in: ['login', 'demo_login'] },
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get user type distribution
    const userTypeDistribution = await Analytics.aggregate([
      {
        $match: {
          eventType: { $in: ['login', 'demo_login'] },
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$userType",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalLogins,
        demoLogins,
        registeredLogins,
        uniqueUsers: uniqueUsers.length,
        dailyLogins,
        userTypeDistribution,
        startDate,
        endDate: now
      }
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      error: 'Failed to get analytics data',
      message: error.message
    });
  }
});

// @desc    Get basic stats (public)
// @route   GET /api/analytics/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // Get total logins (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const totalLogins = await Analytics.countDocuments({
      eventType: { $in: ['login', 'demo_login'] },
      timestamp: { $gte: thirtyDaysAgo }
    });

    const demoLogins = await Analytics.countDocuments({
      eventType: 'demo_login',
      timestamp: { $gte: thirtyDaysAgo }
    });

    const registeredLogins = await Analytics.countDocuments({
      eventType: 'login',
      timestamp: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalLogins,
        demoLogins,
        registeredLogins,
        period: '30d'
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Failed to get stats',
      message: error.message
    });
  }
});

module.exports = router;
