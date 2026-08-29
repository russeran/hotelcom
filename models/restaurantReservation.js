const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantReservationSchema = new Schema({
    // Restaurant
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    restaurantName: { type: String, required: true },
    
    // Guest information
    guestName: { type: String, required: true, index: true },
    guestEmail: { type: String },
    guestPhone: { type: String },
    guestRoom: { type: String }, // If hotel guest
    
    // Reservation details
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true }, // HH:MM format
    partySize: { type: Number, required: true },
    
    // Table assignment
    tableNumber: { type: String },
    tableId: { type: Schema.Types.ObjectId },
    autoAssigned: { type: Boolean, default: false },
    
    // Status
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Seated', 'Completed', 'Cancelled', 'No Show'],
        default: 'Pending'
    },
    
    // Special requests
    specialRequests: { type: String },
    dietaryRestrictions: [{ type: String }],
    occasion: { type: String }, // Birthday, Anniversary, Business, etc.
    seatingPreferences: [{ type: String }], // Window, Quiet, Patio, etc.
    
    // Timing
    seatedAt: { type: Date },
    completedAt: { type: Date },
    estimatedDuration: { type: Number }, // minutes
    
    // Confirmation & Communications
    confirmationNumber: { type: String, unique: true, index: true },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    smsSent: { type: Boolean, default: false },
    smsSentAt: { type: Date },
    reminderSent: { type: Boolean, default: false },
    reminderSentAt: { type: Date },
    
    // POS Integration
    posOrderId: { type: String },
    posTableId: { type: String },
    posSynced: { type: Boolean, default: false },
    posSyncedAt: { type: Date },
    totalAmount: { type: Number },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Cancelled'], default: 'Pending' },
    
    // Notes
    notes: { type: String },
    
    createdBy: { type: String },
    modifiedBy: { type: String }
}, {
    timestamps: true
});

// Generate confirmation number before save
restaurantReservationSchema.pre('save', function(next) {
    if (!this.confirmationNumber) {
        this.confirmationNumber = 'RES' + Date.now().toString(36).toUpperCase();
    }
    next();
});

// Indexes
restaurantReservationSchema.index({ restaurantId: 1, date: 1, status: 1 });
restaurantReservationSchema.index({ guestName: 'text', guestPhone: 'text' });

module.exports = mongoose.model('RestaurantReservation', restaurantReservationSchema);
