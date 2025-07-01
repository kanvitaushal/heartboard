const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for designs routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Designs route - coming soon' });
});

module.exports = router; 