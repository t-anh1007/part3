// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    // If it's an API request, return JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    // For regular requests, redirect to login
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  } else {
    // If it's an API request, return JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    // For regular requests, redirect with error
    req.flash('error', 'Admin access required');
    return res.redirect('/');
  }
};

// Middleware to check if user is already logged in
const requireGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  next();
};

// Middleware to make user info available in all templates
const addUserToLocals = (req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    username: req.session.username,
    role: req.session.userRole
  } : null;
  res.locals.isAuthenticated = !!req.session.userId;
  res.locals.isAdmin = req.session.userRole === 'admin';
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireGuest,
  addUserToLocals
};