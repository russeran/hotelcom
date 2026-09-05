const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    cuisine: { type: String },
    
    // Hours
    hours: {
        monday: { open: String, close: String, closed: { type: Boolean, default: false } },
        tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
        friday: { open: String, close: String, closed: { type: Boolean, default: false } },
        saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
        sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
    },
    
    // Capacity
    totalCapacity: { type: Number, required: true },
    
    // Tables
    tables: [{
        number: { type: String, required: true },
        capacity: { type: Number, required: true },
        location: { type: String }, // Window, Patio, Indoor, etc.
        type: { type: String }, // Standard, Booth, Bar, Private
        qrCode: { type: String }, // QR code data or URL
        qrCodeGenerated: { type: Boolean, default: false }
    }],
    
    // Reservation settings
    reservationDuration: { type: Number, default: 90 }, // minutes
    advanceBookingDays: { type: Number, default: 30 },
    minPartySize: { type: Number, default: 1 },
    maxPartySize: { type: Number, default: 20 },
    waitlistEnabled: { type: Boolean, default: true },
    autoAssignTables: { type: Boolean, default: true },
    
    // Contact
    phone: { type: String },
    email: { type: String },
    
    // Menu
    menuUrl: { type: String },
    menuPdfUrl: { type: String },
    menuQrCode: { type: String },
    
    // POS Integration
    posIntegration: {
        enabled: { type: Boolean, default: false },
        provider: { type: String }, // 'Square', 'Toast', 'Clover', etc.
        locationId: { type: String },
        apiKey: { type: String },
        webhookUrl: { type: String },
        syncOrders: { type: Boolean, default: false }
    },
    
    // Email & SMS
    notifications: {
        emailEnabled: { type: Boolean, default: false },
        smsEnabled: { type: Boolean, default: false },
        sendConfirmations: { type: Boolean, default: false },
        sendReminders: { type: Boolean, default: false },
        reminderHoursBefore: { type: Number, default: 24 }
    },
    
    // Status
    active: { type: Boolean, default: true },
    
    createdBy: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
