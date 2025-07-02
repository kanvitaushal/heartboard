const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Placeholder for todos routes
router.get('/', protect, (req, res) => {
  res.json({ message: 'Todos route - coming soon' });
});

module.exports = router; 