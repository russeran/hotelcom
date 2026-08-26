// Route guard factory: allow only the given roles.
// Assumes checkToken has already run and set req.user (with role) from the JWT.
module.exports = function requireRole(...roles) {
    return function (req, res, next) {
        if (!req.user) return res.status(401).json('Unauthorized');
        if (!roles.includes(req.user.role)) {
            return res.status(403).json('Forbidden: insufficient permissions');
        }
        next();
    };
};
