const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for memories routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Memories route - coming soon' });
});

module.exports = router; 