const mongoose = require('mongoose')
const Schema = mongoose.Schema


const complaintSchema = new Schema({
    date: { type: Date, default: Date.now },
    room: { type: Number, required: true },
    name: { type: String, required: true },
    issue: { type: String, required: true },
    solution: { type: String, required: true },
    status: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Complaint', complaintSchema)