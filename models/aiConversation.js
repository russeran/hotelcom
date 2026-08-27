const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aiConversationSchema = new Schema({
    sessionId: { type: String, required: true, index: true },
    guestName: { type: String, required: false },
    roomNumber: { type: String, required: false },
    reservationId: { type: Schema.Types.ObjectId, ref: 'Reservation', required: false },
    verified: { type: Boolean, default: false },
    messages: [{
        role: { type: String, enum: ['guest', 'ai', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    actionsTaken: [{
        type: { type: String, enum: ['task', 'complaint', 'reservation_update', 'information'], required: true },
        entityId: { type: Schema.Types.ObjectId, required: false },
        description: { type: String, required: false },
        timestamp: { type: Date, default: Date.now }
    }],
    status: { type: String, enum: ['active', 'completed', 'transferred'], default: 'active' },
    satisfaction: { type: Number, min: 1, max: 5, required: false },
    metadata: {
        totalMessages: { type: Number, default: 0 },
        duration: { type: Number, required: false },
        intent: { type: String, required: false }
    }
}, {
    timestamps: true
});

// Index for efficient querying
aiConversationSchema.index({ createdAt: -1 });
aiConversationSchema.index({ verified: 1, status: 1 });

module.exports = mongoose.model('AiConversation', aiConversationSchema);
