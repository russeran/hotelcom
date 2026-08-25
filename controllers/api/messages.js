const Message = require('../../models/message')

module.exports = {
    index,
    create
};

async function index(req, res) {
    // Return the 100 most recent messages in chronological order.
    const messages = await Message.find({}).sort({ createdAt: 1 }).limit(100)
    res.json(messages)
}

async function create(req, res) {
    // Trust the authenticated user's name as the author.
    const message = await Message.create({
        user: req.user.name,
        text: req.body.text
    })
    return res.json(message)
}
