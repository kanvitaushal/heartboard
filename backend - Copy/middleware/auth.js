const jwt = require('jsonwebtoken');

// In-memory user storage for demo (shared with auth routes)
let users = [];

// Set users array (will be set from auth routes)
exports.setUsers = (usersArray) => {
  users = usersArray;
};

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      error: 'Not authorized to access this route',
      message: 'Please log in to access this resource'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');

    // Get user from memory
    const user = users.find(user => user.id === decoded.id);

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'The user belonging to this token no longer exists'
      });
    }

    req.user = {
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Not authorized to access this route',
      message: 'Invalid or expired token'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');
      const user = users.find(user => user.id === decoded.id);
      if (user) {
        req.user = {
          _id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified
        };
      } else {
        req.user = null;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      req.user = null;
    }
  }

  next();
}; 