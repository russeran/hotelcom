const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userPreferencesSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    dashboardLayout: {
        cards: [{
            id: { type: String, required: true },
            type: { type: String, required: true },
            title: String,
            position: { type: Number, required: true },
            visible: { type: Boolean, default: true },
            size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' }
        }]
    },
    theme: { type: String, enum: ['dark', 'light', 'auto'], default: 'dark' },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

userPreferencesSchema.index({ userId: 1 });

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
