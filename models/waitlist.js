const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waitlistSchema = new Schema({
    // Restaurant
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    restaurantName: { type: String, required: true },
    
    // Guest information
    guestName: { type: String, required: true, index: true },
    guestEmail: { type: String },
    guestPhone: { type: String, required: true },
    guestRoom: { type: String },
    
    // Waitlist details
    date: { type: Date, required: true, index: true },
    requestedTime: { type: String }, // HH:MM format
    partySize: { type: Number, required: true },
    
    // Status
    status: {
        type: String,
        enum: ['Waiting', 'Notified', 'Confirmed', 'Seated', 'Expired', 'Cancelled'],
        default: 'Waiting'
    },
    
    // Position
    position: { type: Number }, // Position in waitlist
    estimatedWait: { type: Number }, // minutes
    
    // Special requests
    specialRequests: { type: String },
    seatingPreferences: [{ type: String }],
    
    // Notifications
    notifiedAt: { type: Date },
    notificationMethod: { type: String, enum: ['Phone', 'SMS', 'Email', 'None'] },
    
    // Timing
    joinedAt: { type: Date, default: Date.now },
    confirmedAt: { type: Date },
    seatedAt: { type: Date },
    expiresAt: { type: Date },
    
    // Converted to reservation
    convertedToReservation: { type: Boolean, default: false },
    reservationId: { type: Schema.Types.ObjectId, ref: 'RestaurantReservation' },
    
    // Notes
    notes: { type: String },
    
    createdBy: { type: String }
}, {
    timestamps: true
});

// Indexes
waitlistSchema.index({ restaurantId: 1, date: 1, status: 1 });
waitlistSchema.index({ status: 1, position: 1 });

module.exports = mongoose.model('Waitlist', waitlistSchema);
