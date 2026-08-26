const Room = require('../../models/room')
const audit = require('./audit')

module.exports = {
    index,
    create,
    update,
    delete: deleteRoom
};

async function index(req, res) {
    const rooms = await Room.find({}).sort({ number: 1 })
    res.json(rooms)
}

async function create(req, res) {
    const room = await Room.create({
        number: req.body.number,
        type: req.body.type,
        status: req.body.status,
        notes: req.body.notes
    })
    await audit.record({ req, action: 'create', entity: 'room', entityId: room._id, details: `Room ${room.number} (${room.type || 'room'})` })
    res.json(room)
}

async function update(req, res) {
    const updates = {}
    for (const key of ['number', 'type', 'status', 'notes']) {
        if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!room) return res.status(404).json('Room not found')
    await audit.record({ req, action: 'update', entity: 'room', entityId: room._id, details: `Room ${room.number} → ${JSON.stringify(updates)}` })
    res.json(room)
}

async function deleteRoom(req, res) {
    const room = await Room.findByIdAndDelete(req.params.id)
    if (!room) return res.status(404).json('Room not found')
    await audit.record({ req, action: 'delete', entity: 'room', entityId: room._id, details: `Room ${room.number}` })
    res.json(room)
}
