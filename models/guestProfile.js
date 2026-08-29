const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guestProfileSchema = new Schema({
    name: { type: String, required: true, index: true },
    email: { type: String, sparse: true, index: true },
    phone: { type: String },
    
    // Preferences
    roomPreferences: {
        floor: { type: String },
        view: { type: String },
        bedType: { type: String },
        temperature: { type: String }
    },
    
    // Special needs
    specialRequests: [{ type: String }],
    allergies: [{ type: String }],
    dietaryRestrictions: [{ type: String }],
    
    // VIP Status
    vipStatus: { type: String, enum: ['Regular', 'Silver', 'Gold', 'Platinum'], default: 'Regular' },
    
    // Stay history (computed from reservations)
    totalStays: { type: Number, default: 0 },
    lastStay: { type: Date },
    
    // Notes
    notes: [{
        note: { type: String, required: true },
        addedBy: { type: String },
        date: { type: Date, default: Date.now }
    }],
    
    // Occasions
    occasions: [{
        type: { type: String, enum: ['Birthday', 'Anniversary', 'Other'] },
        date: { type: Date },
        note: { type: String }
    }],
    
    createdBy: { type: String }
}, {
    timestamps: true
});

// Indexes for searching
guestProfileSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('GuestProfile', guestProfileSchema);
