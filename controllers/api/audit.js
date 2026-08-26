const AuditLog = require('../../models/auditLog')

module.exports = {
    index,
    record
};

// Admin-only: the most recent activity, newest first.
async function index(req, res) {
    const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(200)
    res.json(logs)
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
