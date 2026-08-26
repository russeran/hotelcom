const mongoose = require('mongoose')
const Schema = mongoose.Schema


const complaintSchema = new Schema({
    //get today's ISOS date for date field
    date: { type: Date, default: Date.now },
    room: { type: Number, required: false },
    name: { type: String, required: false },
    issue: { type: String, required: false },
    solution: { type: String, required: false },
    status: { type: String, required: false },
    department: { type: String, default: 'Front Desk' },
    user: { type: String, required: false }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Complaint', complaintSchema)