const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ROOM_STATUSES = ['Vacant Clean', 'Vacant Dirty', 'Occupied', 'Inspected', 'Out of Order'];

const roomSchema = new Schema({
    number: { type: String, required: true },
    type: { type: String, required: false },   // King, Queen, Suite, etc.
    status: { type: String, enum: ROOM_STATUSES, default: 'Vacant Clean' },
    notes: { type: String, required: false }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Room', roomSchema)
module.exports.STATUSES = ROOM_STATUSES
