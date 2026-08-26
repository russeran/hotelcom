const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Resolve the request's user from the JWT, then re-hydrate role/identity from
// the database on every request. This makes authorization decisions reflect the
// CURRENT state (role/department changes and account deletions take effect
// immediately, server-side) instead of trusting the potentially-stale token.
module.exports = function(req, res, next) {
  let token = req.get('Authorization') || req.query.token;
  if (!token) {
    req.user = null;
    return next();
  }
  // Remove the 'Bearer ' if it was included in the token header
  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.SECRET, async function(err, decoded) {
    if (err || !decoded || !decoded.user) {
      req.user = null;
      req.exp = null;
      return next();
    }
    req.exp = new Date(decoded.exp * 1000);
    try {
      // The token only proves identity; the authoritative role comes from the DB.
      const user = await User.findById(decoded.user._id);
      if (!user) {
        // Account no longer exists -> treat as logged out (instant lockout).
        req.user = null;
        return next();
      }
      req.user = {
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar
      };
    } catch (e) {
      console.log('checkToken error', e);
      req.user = null;
    }
    return next();
  });
};
