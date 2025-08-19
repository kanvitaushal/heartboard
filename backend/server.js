const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
const allowedOrigins = [
  'https://heartboard.vercel.app',
  'https://heartboard-kwyu8b1f8-kanvitaushauls-projects.vercel.app',
  'https://heartboard-git-main-kanvitaushauls-projects.vercel.app',
  'https://heartboard-*.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Check specific allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For production, be more strict
    if (process.env.NODE_ENV === 'production') {
      return callback(new Error('Not allowed by CORS'));
    }
    
    // For development, allow all origins
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/gifts', require('./routes/gifts'));
app.use('/api/letters', require('./routes/letters'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/todos', require('./routes/todos'));
app.use('/api/designs', require('./routes/designs'));
app.use('/api/countdowns', require('./routes/countdowns'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Heartboard API is running!',
    author: 'Made with ❤️ by Tanvi Kaushal',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || !process.env.JWT_SECRET) {
  console.log('❌ Missing MONGODB_URI or JWT_SECRET in config.env. Running in DEMO MODE.');
  app.listen(PORT, () => {
    console.log(`🚀 Heartboard Backend running on port ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log('🎭 Running in DEMO MODE - No database required');
  });
} else {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Heartboard Backend running on port ${PORT}`);
        console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
        console.log(`🔗 API URL: http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
} 