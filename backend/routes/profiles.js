const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for profiles routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Profiles route - coming soon' });
});

module.exports = router; 