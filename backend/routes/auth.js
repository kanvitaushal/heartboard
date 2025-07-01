const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { setUsers } = require('../middleware/auth');

const router = express.Router();

// In-memory user storage for demo
const users = [];

// Share users array with middleware
setUsers(users);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'demo-secret', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password });
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      avatar: '',
      role: 'user',
      isVerified: true,
      preferences: {},
      createdAt: new Date()
    };

    users.push(user);
    console.log('User registered:', user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified
      },
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        preferences: user.preferences
      },
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');
    const user = users.find(user => user.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      error: 'Invalid token',
      message: 'Access denied'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { name, email, phone, preferences } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');
    const userIndex = users.findIndex(user => user.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    const user = users[userIndex];
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.preferences = { ...user.preferences, ...preferences };

    users[userIndex] = user;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');
    const userIndex = users.findIndex(user => user.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    const user = users[userIndex];

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid current password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    users[userIndex] = user;

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Failed to change password',
      message: error.message
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this email'
      });
    }

    // In a real app, you would send an email here
    res.json({
      success: true,
      message: 'Password reset email sent (demo mode)'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Failed to process request',
      message: error.message
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // In a real app, you would verify the reset token here
    res.json({
      success: true,
      message: 'Password reset successfully (demo mode)'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Failed to reset password',
      message: error.message
    });
  }
});

module.exports = router; 