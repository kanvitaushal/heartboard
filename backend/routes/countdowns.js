const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for countdowns routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Countdowns route - coming soon' });
});

module.exports = router; 