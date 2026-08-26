// Minimal request-body validation. requireFields(...names) rejects the request
// with 400 when any listed field is missing or blank, before it reaches the
// controller (Mongoose still enforces types/enums as a second layer).
function requireFields(...fields) {
    return function (req, res, next) {
        const missing = fields.filter(f => {
            const v = req.body ? req.body[f] : undefined;
            return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
        });
        if (missing.length) {
            return res.status(400).json(`Missing required field(s): ${missing.join(', ')}`);
        }
        next();
    };
}

module.exports = { requireFields };
