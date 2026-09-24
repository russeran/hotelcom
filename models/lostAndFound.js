const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lostAndFoundSchema = new Schema({
    itemDescription: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Clothing', 'Electronics', 'Jewelry', 'Documents', 'Keys', 'Bags', 'Personal Items', 'Other'],
        required: true 
    },
    
    // Where found
    location: { type: String, required: true },
    room: { type: String },
    
    // Status
    status: { 
        type: String, 
        enum: ['Unclaimed', 'Claimed', 'Disposed'],
        default: 'Unclaimed'
    },
    
    // Dates
    dateFound: { type: Date, required: true, default: Date.now },
    disposalDate: { type: Date }, // When to dispose if unclaimed
    
    // Storage
    storageLocation: { type: String },
    
    // Guest info (if known)
    guestName: { type: String },
    guestRoom: { type: String },
    guestContact: { type: String },
    
    // Claim info
    claimedBy: { type: String },
    claimedDate: { type: Date },
    claimNotes: { type: String },
    
    // Photos
    photos: [{ type: String }],
    
    // Staff
    foundBy: { type: String, required: true },
    notes: { type: String }
}, {
    timestamps: true
});

// Indexes
lostAndFoundSchema.index({ status: 1, dateFound: -1 });
lostAndFoundSchema.index({ room: 1 });

module.exports = mongoose.model('LostAndFound', lostAndFoundSchema);
