const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RESERVATION_STATUSES = ['Booked', 'Checked In', 'Checked Out', 'Cancelled'];

const reservationSchema = new Schema({
    guestName: { type: String, required: true },
    room: { type: String, required: false },
    checkIn: { type: Date, required: false },
    checkOut: { type: Date, required: false },
    status: { type: String, enum: RESERVATION_STATUSES, default: 'Booked' },
    notes: { type: String, required: false },
    createdBy: { type: String, required: false }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Reservation', reservationSchema)
module.exports.STATUSES = RESERVATION_STATUSES
