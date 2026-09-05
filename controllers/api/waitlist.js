const Waitlist = require('../../models/waitlist');
const Restaurant = require('../../models/restaurant');
const RestaurantReservation = require('../../models/restaurantReservation');
const { sendWaitlistNotificationSMS } = require('../../services/smsService');
const { autoAssignTable } = require('../../services/tableAssignment');

module.exports = {
    async index(req, res) {
        try {
            const { restaurantId, date, status } = req.query;
            const query = {};
            
            if (restaurantId) query.restaurantId = restaurantId;
            if (status && status !== 'all') query.status = status;
            if (date) {
                const startDate = new Date(date);
                const endDate = new Date(date);
                endDate.setDate(endDate.getDate() + 1);
                query.date = { $gte: startDate, $lt: endDate };
            }
            
            const waitlist = await Waitlist.find(query)
                .sort({ date: 1, position: 1 })
                .populate('restaurantId', 'name');
            res.json(waitlist);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const restaurant = await Restaurant.findById(req.body.restaurantId);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            
            // Get current waitlist count for position
            const count = await Waitlist.countDocuments({
                restaurantId: req.body.restaurantId,
                date: req.body.date,
                status: { $in: ['Waiting', 'Notified'] }
            });

            const entry = await Waitlist.create({
                ...req.body,
                restaurantName: restaurant.name,
                position: count + 1,
                estimatedWait: (count + 1) * (restaurant.reservationDuration || 90),
                createdBy: req.user.name
            });

            res.status(201).json(entry);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const entry = await Waitlist.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!entry) return res.status(404).json({ error: 'Waitlist entry not found' });
            res.json(entry);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const entry = await Waitlist.findByIdAndDelete(req.params.id);
            if (!entry) return res.status(404).json({ error: 'Waitlist entry not found' });
            
            // Recalculate positions for remaining entries
            await recalculatePositions(entry.restaurantId, entry.date);
            
            res.json({ message: 'Waitlist entry deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async notify(req, res) {
        try {
            const entry = await Waitlist.findById(req.params.id);
            if (!entry) return res.status(404).json({ error: 'Waitlist entry not found' });
            
            // Send SMS notification
            const result = await sendWaitlistNotificationSMS(entry._id);
            
            res.json({ notified: result.sent, entry });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async convertToReservation(req, res) {
        try {
            const entry = await Waitlist.findById(req.params.id);
            if (!entry) return res.status(404).json({ error: 'Waitlist entry not found' });
            
            // Create reservation from waitlist
            const reservation = await RestaurantReservation.create({
                restaurantId: entry.restaurantId,
                restaurantName: entry.restaurantName,
                guestName: entry.guestName,
                guestEmail: entry.guestEmail,
                guestPhone: entry.guestPhone,
                guestRoom: entry.guestRoom,
                date: entry.date,
                time: entry.requestedTime || new Date().toTimeString().slice(0, 5),
                partySize: entry.partySize,
                specialRequests: entry.specialRequests,
                seatingPreferences: entry.seatingPreferences,
                status: 'Confirmed',
                createdBy: req.user.name
            });

            // Auto-assign table
            await autoAssignTable(reservation._id);

            // Update waitlist entry
            entry.convertedToReservation = true;
            entry.reservationId = reservation._id;
            entry.status = 'Seated';
            entry.seatedAt = new Date();
            await entry.save();

            // Recalculate positions
            await recalculatePositions(entry.restaurantId, entry.date);

            res.json({ reservation, waitlist: entry });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};

// Helper: Recalculate waitlist positions
async function recalculatePositions(restaurantId, date) {
    const entries = await Waitlist.find({
        restaurantId,
        date,
        status: { $in: ['Waiting', 'Notified'] }
    }).sort({ joinedAt: 1 });

    for (let i = 0; i < entries.length; i++) {
        entries[i].position = i + 1;
        await entries[i].save();
    }
}
