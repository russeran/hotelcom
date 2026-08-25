const Notification = require('../../models/notification')

module.exports = {
    index,
    create,
    markRead,
    delete: deleteNotification,
    notify
};

async function index(req, res) {
    const notifications = await Notification.find({}).sort({ createdAt: -1 })
    res.json(notifications)
}

async function create(req, res) {
    const notification = await Notification.create(req.body)
    return res.json(notification)
}

async function markRead(req, res) {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    return res.json(notification)
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
        return await Notification.create({ department, message, type })
    } catch (err) {
        console.log('notify error', err)
        return null
    }
}
