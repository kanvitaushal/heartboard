const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for user management routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Users route - coming soon' });
});

module.exports = router; 