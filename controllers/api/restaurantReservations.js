const RestaurantReservation = require('../../models/restaurantReservation');
const Restaurant = require('../../models/restaurant');

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
            // Get restaurant name
            const restaurant = await Restaurant.findById(req.body.restaurantId);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            
            const reservation = await RestaurantReservation.create({
                ...req.body,
                restaurantName: restaurant.name,
                createdBy: req.user.name
            });
            res.status(201).json(reservation);
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
    }
};
