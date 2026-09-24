const RestaurantReservation = require('../../models/restaurantReservation');
const Restaurant = require('../../models/restaurant');
const { autoAssignTable } = require('../../services/tableAssignment');
const { sendConfirmationEmail, sendReminderEmail } = require('../../services/emailService');
const { sendConfirmationSMS, sendReminderSMS } = require('../../services/smsService');
const { syncReservationToPOS } = require('../../services/posIntegration');

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
            
            const reservations = await RestaurantReservation.find(query)
                .sort({ date: 1, time: 1 })
                .populate('restaurantId', 'name');
            res.json(reservations);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async show(req, res) {
        try {
            const reservation = await RestaurantReservation.findById(req.params.id)
                .populate('restaurantId', 'name phone');
            if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
            res.json(reservation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            // Get restaurant
            const restaurant = await Restaurant.findById(req.body.restaurantId);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            
            const reservation = await RestaurantReservation.create({
                ...req.body,
                restaurantName: restaurant.name,
                estimatedDuration: restaurant.reservationDuration || 90,
                createdBy: req.user.name
            });

            // Auto-assign table if enabled
            if (restaurant.autoAssignTables) {
                await autoAssignTable(reservation._id);
            }

            // Send confirmation email if enabled
            if (restaurant.notifications?.emailEnabled && restaurant.notifications?.sendConfirmations && reservation.guestEmail) {
                await sendConfirmationEmail(reservation._id);
            }

            // Send confirmation SMS if enabled
            if (restaurant.notifications?.smsEnabled && restaurant.notifications?.sendConfirmations && reservation.guestPhone) {
                await sendConfirmationSMS(reservation._id);
            }

            // Sync to POS if enabled
            if (restaurant.posIntegration?.enabled && restaurant.posIntegration?.syncOrders) {
                await syncReservationToPOS(reservation._id);
            }

            // Reload to get updated data
            const updated = await RestaurantReservation.findById(reservation._id);
            res.status(201).json(updated);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const reservation = await RestaurantReservation.findByIdAndUpdate(
                req.params.id,
                { ...req.body, modifiedBy: req.user.name },
                { new: true, runValidators: true }
            );
            if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
            res.json(reservation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const reservation = await RestaurantReservation.findByIdAndDelete(req.params.id);
            if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
            res.json({ message: 'Reservation deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const update = { status, modifiedBy: req.user.name };
            
            if (status === 'Seated') update.seatedAt = new Date();
            if (status === 'Completed') update.completedAt = new Date();
            
            const reservation = await RestaurantReservation.findByIdAndUpdate(
                req.params.id,
                update,
                { new: true, runValidators: true }
            );
            if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
            res.json(reservation);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async checkAvailability(req, res) {
        try {
            const { restaurantId, date, time, partySize } = req.query;
            
            // Get restaurant
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            
            // Get reservations for that date/time
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            
            const reservations = await RestaurantReservation.find({
                restaurantId,
                date: { $gte: startDate, $lt: endDate },
                status: { $nin: ['Cancelled', 'No Show', 'Completed'] }
            });
            
            // Calculate available capacity (simplified - just count party sizes)
            const reservedCapacity = reservations
                .filter(r => {
                    // Check if time overlaps (within reservation duration)
                    const resTime = parseInt(r.time.replace(':', ''));
                    const checkTime = parseInt(time.replace(':', ''));
                    const duration = restaurant.reservationDuration / 60 * 100; // convert to hours in HHMM format
                    return Math.abs(resTime - checkTime) < duration;
                })
                .reduce((sum, r) => sum + r.partySize, 0);
            
            const availableCapacity = restaurant.totalCapacity - reservedCapacity;
            const available = availableCapacity >= parseInt(partySize);
            
            res.json({
                available,
                availableCapacity,
                totalCapacity: restaurant.totalCapacity,
                reservedCapacity
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async sendConfirmation(req, res) {
        try {
            const reservation = await RestaurantReservation.findById(req.params.id);
            if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

            const results = {};

            // Send email
            if (reservation.guestEmail) {
                results.email = await sendConfirmationEmail(reservation._id);
            }

            // Send SMS
            if (reservation.guestPhone) {
                results.sms = await sendConfirmationSMS(reservation._id);
            }

            res.json({ sent: true, results });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async sendReminder(req, res) {
        try {
            const reservation = await RestaurantReservation.findById(req.params.id);
            if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

            const results = {};

            // Send email
            if (reservation.guestEmail) {
                results.email = await sendReminderEmail(reservation._id);
            }

            // Send SMS
            if (reservation.guestPhone) {
                results.sms = await sendReminderSMS(reservation._id);
            }

            res.json({ sent: true, results });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async assignTable(req, res) {
        try {
            const result = await autoAssignTable(req.params.id);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
