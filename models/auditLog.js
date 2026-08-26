const mongoose = require('mongoose')
const Schema = mongoose.Schema

const auditLogSchema = new Schema({
    actorId: { type: String, required: false },
    actor: { type: String, required: false },   // actor's name at time of action
    role: { type: String, required: false },     // actor's role at time of action
    action: { type: String, required: true },    // 'create' | 'update' | 'delete' | 'role_change'
    entity: { type: String, required: true },     // 'task' | 'complaint' | 'note' | 'concierge' | 'user'
    entityId: { type: String, required: false },
    details: { type: String, required: false }
}, {
    timestamps: true,
})

module.exports = mongoose.model('AuditLog', auditLogSchema)
