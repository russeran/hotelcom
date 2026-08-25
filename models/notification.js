const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    department: { type: String, required: false },
    message: { type: String, required: true },
    type: { type: String, required: false }, // 'task' | 'complaint' | 'general'
    read: { type: Boolean, default: false }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Notification', notificationSchema)
