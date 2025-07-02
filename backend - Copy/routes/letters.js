const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for letters routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Letters route - coming soon' });
});

module.exports = router; 