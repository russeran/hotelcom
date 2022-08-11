const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    status: { type: String, required: false },
    date: { type: Date, default: Date.now },
    department: { type: String, required: false },
    room: { type: Number, required: false },
    user: { type: String, required: false },
    task: { type: String, required: false }

}, {
    timestamps: true,
})


module.exports = mongoose.model('Task', taskSchema)