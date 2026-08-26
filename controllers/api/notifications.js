const Notification = require('../../models/notification')
const io = require('../../config/io')

module.exports = {
    index,
    create,
    markRead,
    delete: deleteNotification,
    notify
};

async function index(req, res) {
    // Admins see everything. Staff and managers with an assigned department see
    // notifications for their department plus general (department-less) ones.
    let filter = {}
    if (req.user && req.user.role !== 'admin' && req.user.department) {
        filter = {
            $or: [
                { department: req.user.department },
                { department: { $in: [null, ''] } },
                { department: { $exists: false } }
            ]
        }
    }
    const notifications = await Notification.find(filter).sort({ createdAt: -1 })
    // Compute a per-user `read` flag from readBy so read state isn't shared
    // across users.
    const uid = req.user && req.user._id
    res.json(notifications.map(n => {
        const obj = n.toObject()
        obj.read = Array.isArray(n.readBy) && n.readBy.includes(uid)
        return obj
    }))
}

async function create(req, res) {
    const notification = await Notification.create(req.body)
    return res.json(notification)
}

async function markRead(req, res) {
    const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { readBy: req.user._id } },
        { new: true }
    )
    if (!notification) return res.status(404).json('Notification not found')
    const obj = notification.toObject()
    obj.read = true
    return res.json(obj)
}

async function deleteNotification(req, res) {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    return res.json(notification)
}

// Internal helper used by other controllers to emit a notification for a
// department. Best-effort: never let a notification failure break the
// primary action (e.g. creating a task or complaint).
async function notify({ department, message, type }) {
    try {
        const n = await Notification.create({ department, message, type })
        // Real-time ping; clients re-fetch their (server-scoped) feed.
        io.emit('notification:new', { department, type })
        return n
    } catch (err) {
        console.log('notify error', err)
        return null
    }
}
