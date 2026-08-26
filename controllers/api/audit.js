const AuditLog = require('../../models/auditLog')

module.exports = {
    index,
    record
};

// Admin-only: the most recent activity, newest first. Paginated via limit/skip.
async function index(req, res) {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200)
    const skip = parseInt(req.query.skip, 10) || 0
    const [logs, total] = await Promise.all([
        AuditLog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
        AuditLog.countDocuments({})
    ])
    res.json({ logs, total, skip, limit })
}

// Best-effort helper used by other controllers to record a mutation.
// Never throws — an audit failure must not break the primary action.
async function record({ req, action, entity, entityId, details }) {
    try {
        if (!req || !req.user) return null
        return await AuditLog.create({
            actorId: req.user._id,
            actor: req.user.name,
            role: req.user.role,
            action,
            entity,
            entityId: entityId ? String(entityId) : undefined,
            details
        })
    } catch (err) {
        console.log('audit error', err)
        return null
    }
}
