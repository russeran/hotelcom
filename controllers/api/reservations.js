const Reservation = require('../../models/reservation')
const Room = require('../../models/room')
const GuestProfile = require('../../models/guestProfile')
const notifications = require('./notifications')
const audit = require('./audit')

module.exports = {
    index,
    create,
    update,
    delete: deleteReservation
};

async function index(req, res) {
    const reservations = await Reservation.find({}).sort({ checkIn: 1 })
    res.json(reservations)
}

async function create(req, res) {
    const reservation = await Reservation.create({
        guestName: req.body.guestName,
        room: req.body.room,
        checkIn: req.body.checkIn || undefined,
        checkOut: req.body.checkOut || undefined,
        notes: req.body.notes,
        status: req.body.status,
        createdBy: req.user.name
    })
    
    // Guest Profile integration: find or create a profile for this guest
    try {
        let profile = await GuestProfile.findOne({ name: req.body.guestName })
        if (!profile) {
            profile = await GuestProfile.create({
                name: req.body.guestName,
                totalStays: 0,
                createdBy: req.user.name
            })
        }
    } catch (err) {
        console.error('Guest profile creation failed:', err)
    }
    
    await audit.record({ req, action: 'create', entity: 'reservation', entityId: reservation._id, details: `${reservation.guestName} · room ${reservation.room || '—'}` })
    res.json(reservation)
}

async function update(req, res) {
    const updates = {}
    for (const key of ['guestName', 'room', 'checkIn', 'checkOut', 'status', 'notes']) {
        if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!reservation) return res.status(404).json('Reservation not found')

    // Cross-department automation on check-in / check-out.
    if (updates.status && reservation.room) {
        if (updates.status === 'Checked In') {
            await Room.findOneAndUpdate({ number: reservation.room }, { status: 'Occupied' })
        } else if (updates.status === 'Checked Out') {
            await Room.findOneAndUpdate({ number: reservation.room }, { status: 'Vacant Dirty' })
            await notifications.notify({
                department: 'Housekeeping',
                message: `Room ${reservation.room} checked out — needs cleaning`,
                type: 'task'
            })
            
            // Guest Profile integration: update stay history on checkout
            try {
                const profile = await GuestProfile.findOne({ name: reservation.guestName })
                if (profile) {
                    profile.totalStays = (profile.totalStays || 0) + 1
                    profile.lastStay = new Date()
                    await profile.save()
                }
            } catch (err) {
                console.error('Guest profile update failed:', err)
            }
        }
    }

    await audit.record({ req, action: 'update', entity: 'reservation', entityId: reservation._id, details: JSON.stringify(updates) })
    res.json(reservation)
}

async function deleteReservation(req, res) {
    const reservation = await Reservation.findByIdAndDelete(req.params.id)
    if (!reservation) return res.status(404).json('Reservation not found')
    await audit.record({ req, action: 'delete', entity: 'reservation', entityId: reservation._id, details: `${reservation.guestName} · room ${reservation.room || '—'}` })
    res.json(reservation)
}
