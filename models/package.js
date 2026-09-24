const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    // Guest info
    guestName: { type: String, required: true, index: true },
    room: { type: String, required: true, index: true },
    
    // Package details
    carrier: { type: String }, // FedEx, UPS, USPS, Amazon, etc.
    trackingNumber: { type: String },
    description: { type: String },
    
    // Status
    status: { 
        type: String, 
        enum: ['Received', 'Notified', 'Picked Up'],
        default: 'Received'
    },
    
    // Dates
    receivedDate: { type: Date, required: true, default: Date.now },
    notifiedDate: { type: Date },
    pickedUpDate: { type: Date },
    
    // Storage
    storageLocation: { type: String },
    
    // Photos
    photos: [{ type: String }],
    
    // Staff tracking
    receivedBy: { type: String, required: true },
    deliveredBy: { type: String },
    
    // Notes
    notes: { type: String },
    
    // Signature/confirmation
    signedBy: { type: String },
    
    // Notifications
    notificationMethod: { type: String, enum: ['Phone', 'Email', 'Room Note', 'AI Concierge', 'None'] },
    notified: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Indexes
packageSchema.index({ status: 1, receivedDate: -1 });
packageSchema.index({ guestName: 'text', room: 'text' });

module.exports = mongoose.model('Package', packageSchema);
