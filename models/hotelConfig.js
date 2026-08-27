const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelConfigSchema = new Schema({
    // Hotel Basic Information
    hotelInfo: {
        name: { type: String, default: 'Hotel' },
        address: { type: String, default: '' },
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        timezone: { type: String, default: 'America/New_York' }
    },

    // Check-in/Check-out Information
    checkinCheckout: {
        checkinTime: { type: String, default: '3:00 PM' },
        checkoutTime: { type: String, default: '11:00 AM' },
        earlyCheckinAvailable: { type: Boolean, default: true },
        lateCheckoutAvailable: { type: Boolean, default: true },
        earlyCheckinFee: { type: String, default: '$50' },
        lateCheckoutFee: { type: String, default: '$50' }
    },

    // Amenities and Services
    amenities: {
        wifi: { available: Boolean, password: String, instructions: String },
        parking: { available: Boolean, cost: String, location: String },
        pool: { available: Boolean, hours: String, location: String },
        gym: { available: Boolean, hours: String, location: String },
        spa: { available: Boolean, hours: String, phone: String },
        businessCenter: { available: Boolean, hours: String, location: String },
        restaurant: { available: Boolean, hours: String, menu: String },
        roomService: { available: Boolean, hours: String, phone: String },
        concierge: { available: Boolean, hours: String, phone: String },
        laundry: { available: Boolean, cost: String, turnaround: String }
    },

    // AI Behavior Configuration
    aiBehavior: {
        enabled: { type: Boolean, default: true },
        requireVerification: { type: Boolean, default: true },
        maxConversationLength: { type: Number, default: 50 },
        autoEscalateKeywords: [String], // e.g., ["emergency", "urgent", "manager"]
        
        // What AI can do
        capabilities: {
            createTasks: { type: Boolean, default: true },
            createComplaints: { type: Boolean, default: true },
            updateReservations: { type: Boolean, default: false },
            provideRoomService: { type: Boolean, default: true },
            bookAmenities: { type: Boolean, default: false }
        },

        // Priority rules
        priorityRules: {
            maintenanceDefault: { type: String, default: 'High', enum: ['Low', 'Normal', 'High', 'Urgent'] },
            housekeepingDefault: { type: String, default: 'Normal', enum: ['Low', 'Normal', 'High', 'Urgent'] },
            complaintDefault: { type: String, default: 'High', enum: ['Low', 'Normal', 'High', 'Urgent'] }
        },

        // Custom system instructions (overrides default prompt)
        customSystemPrompt: { type: String, default: '' },
        
        // Response style
        responseStyle: {
            tone: { type: String, default: 'professional_friendly', enum: ['formal', 'professional_friendly', 'casual', 'enthusiastic'] },
            maxResponseLength: { type: Number, default: 150 } // words
        }
    },

    // Knowledge Base - Hotel-specific information
    knowledgeBase: {
        // Dining
        restaurants: [{
            name: String,
            type: String, // "onsite", "nearby"
            cuisine: String,
            hours: String,
            phone: String,
            priceRange: String,
            description: String,
            reservationsRequired: Boolean,
            distance: String // "In hotel" or "0.5 miles"
        }],

        // Local Attractions
        attractions: [{
            name: String,
            type: String,
            description: String,
            distance: String,
            hours: String,
            cost: String
        }],

        // Transportation
        transportation: {
            airportShuttle: { available: Boolean, schedule: String, cost: String },
            publicTransit: { description: String, nearestStop: String },
            taxi: { description: String, estimatedCost: String },
            rideshare: { description: String, pickupLocation: String },
            carRental: { available: Boolean, companies: String }
        },

        // Common Questions & Answers
        faqs: [{
            question: String,
            answer: String,
            category: String // "checkin", "amenities", "dining", "local", "policies"
        }],

        // Hotel Policies
        policies: [{
            title: String,
            description: String,
            category: String // "pets", "smoking", "noise", "guests", "cancellation"
        }]
    },

    // Escalation Rules
    escalation: {
        // When to transfer to human
        autoTransferKeywords: [String],
        autoTransferAfterMessages: { type: Number, default: 15 },
        autoTransferOnNegativeSentiment: { type: Boolean, default: true },
        
        // Who to transfer to
        transferDepartments: [{
            keyword: String,
            department: String,
            phone: String
        }]
    },

    // Analytics Settings
    analytics: {
        trackSatisfaction: { type: Boolean, default: true },
        requireSatisfactionRating: { type: Boolean, default: false },
        sendDailySummary: { type: Boolean, default: true },
        summaryRecipients: [String] // email addresses
    },

    // Last updated
    lastUpdatedBy: { type: String, required: false },
    
}, {
    timestamps: true
});

// Ensure only one config document exists (singleton pattern)
hotelConfigSchema.statics.getConfig = async function() {
    let config = await this.findOne();
    if (!config) {
        config = await this.create({});
    }
    return config;
};

hotelConfigSchema.statics.updateConfig = async function(updates, userId) {
    let config = await this.getConfig();
    Object.assign(config, updates);
    config.lastUpdatedBy = userId;
    await config.save();
    return config;
};

module.exports = mongoose.model('HotelConfig', hotelConfigSchema);
