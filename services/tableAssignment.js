/**
 * Table Assignment Service
 * Automatically assigns tables based on party size, preferences, and availability
 */

const Restaurant = require('../models/restaurant');
const RestaurantReservation = require('../models/restaurantReservation');

/**
 * Find best table for a reservation
 * @param {ObjectId} restaurantId
 * @param {Number} partySize
 * @param {Array} seatingPreferences - e.g., ['Window', 'Quiet']
 * @param {Date} date
 * @param {String} time
 * @returns {Object} { table, reason }
 */
async function findBestTable(restaurantId, partySize, seatingPreferences = [], date, time) {
    try {
        // Get restaurant with tables
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant || !restaurant.tables || restaurant.tables.length === 0) {
            return { table: null, reason: 'No tables available' };
        }

        // Get existing reservations for that time slot
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const reservations = await RestaurantReservation.find({
            restaurantId,
            date: { $gte: startDate, $lt: endDate },
            status: { $nin: ['Cancelled', 'No Show', 'Completed'] },
            tableId: { $exists: true, $ne: null }
        });

        // Build map of occupied tables
        const occupiedTableIds = new Set();
        const resTime = parseInt(time.replace(':', ''));
        const duration = restaurant.reservationDuration || 90;

        reservations.forEach(res => {
            if (res.tableId) {
                const reservationTime = parseInt(res.time.replace(':', ''));
                // Check if times overlap (within duration)
                const timeDiff = Math.abs(resTime - reservationTime);
                if (timeDiff < duration) {
                    occupiedTableIds.add(res.tableId.toString());
                }
            }
        });

        // Filter available tables
        const availableTables = restaurant.tables.filter(table => 
            !occupiedTableIds.has(table._id.toString())
        );

        if (availableTables.length === 0) {
            return { table: null, reason: 'All tables occupied' };
        }

        // Score tables based on criteria
        const scoredTables = availableTables.map(table => {
            let score = 0;

            // 1. Capacity match (prefer exact or close match)
            const capacityDiff = table.capacity - partySize;
            if (capacityDiff === 0) score += 100; // Perfect match
            else if (capacityDiff > 0 && capacityDiff <= 2) score += 80; // Close match
            else if (capacityDiff > 0) score += 50; // Acceptable
            else score -= 50; // Too small

            // 2. Seating preferences
            if (seatingPreferences && seatingPreferences.length > 0) {
                seatingPreferences.forEach(pref => {
                    if (table.location && table.location.toLowerCase().includes(pref.toLowerCase())) {
                        score += 30;
                    }
                    if (table.type && table.type.toLowerCase().includes(pref.toLowerCase())) {
                        score += 20;
                    }
                });
            }

            // 3. Prefer not too large tables (minimize waste)
            if (capacityDiff > 4) score -= 20;

            return { table, score };
        });

        // Sort by score (highest first)
        scoredTables.sort((a, b) => b.score - a.score);

        // Return best table
        if (scoredTables[0] && scoredTables[0].score > 0) {
            return {
                table: scoredTables[0].table,
                reason: 'Auto-assigned based on capacity and preferences'
            };
        }

        // Fallback: return first available table with sufficient capacity
        const fallbackTable = availableTables.find(t => t.capacity >= partySize);
        if (fallbackTable) {
            return {
                table: fallbackTable,
                reason: 'Auto-assigned (fallback)'
            };
        }

        return { table: null, reason: 'No suitable table found' };
    } catch (error) {
        console.error('Table assignment error:', error);
        return { table: null, reason: 'Assignment error' };
    }
}

/**
 * Auto-assign table to an existing reservation
 */
async function autoAssignTable(reservationId) {
    try {
        const reservation = await RestaurantReservation.findById(reservationId);
        if (!reservation) throw new Error('Reservation not found');

        const { table, reason } = await findBestTable(
            reservation.restaurantId,
            reservation.partySize,
            reservation.seatingPreferences,
            reservation.date,
            reservation.time
        );

        if (table) {
            reservation.tableNumber = table.number;
            reservation.tableId = table._id;
            reservation.autoAssigned = true;
            reservation.notes = reservation.notes 
                ? `${reservation.notes}\n[Auto-assigned: ${reason}]`
                : `[Auto-assigned: ${reason}]`;
            await reservation.save();
            return { success: true, table, reason };
        }

        return { success: false, reason };
    } catch (error) {
        console.error('Auto-assign error:', error);
        return { success: false, reason: error.message };
    }
}

module.exports = {
    findBestTable,
    autoAssignTable
};
