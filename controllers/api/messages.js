const Message = require('../../models/message')
const io = require('../../config/io')

module.exports = {
    index,
    create,
    channels
};

// Per-channel summary (latest message time + count) so the client can show
// unread indicators without loading every channel.
async function channels(req, res) {
    const summary = await Message.aggregate([
        {
            $group: {
                _id: { $ifNull: ['$channel', 'General'] },
                latest: { $max: '$createdAt' },
                count: { $sum: 1 }
            }
        }
    ])
    res.json(summary.map(s => ({ channel: s._id, latest: s.latest, count: s.count })))
}

async function index(req, res) {
    // Optionally scope to a department channel; default to all if unspecified.
    let filter = {}
    if (req.query.channel) {
        // Legacy messages have no `channel` field; treat them as "General".
        filter = req.query.channel === 'General'
            ? { $or: [{ channel: 'General' }, { channel: { $exists: false } }] }
            : { channel: req.query.channel }
    }
    // Pagination: `before` (ISO date) fetches the page of messages immediately
    // older than that timestamp ("load earlier"). We fetch the newest `limit`
    // matching rows then return them ascending for display.
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200)
    if (req.query.before) {
        filter.createdAt = { $lt: new Date(req.query.before) }
    }
    const docs = await Message.find(filter).sort({ createdAt: -1 }).limit(limit)
    res.json(docs.reverse())
}

async function create(req, res) {
    // Trust the authenticated user's name as the author.
    const message = await Message.create({
        user: req.user.name,
        channel: req.body.channel || 'General',
        text: req.body.text
    })
    // Push to connected clients in real time.
    io.emit('chat:new', message)
    return res.json(message)
}
