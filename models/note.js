const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
    date: { type: Date, default: Date.now },
    user: { type: String, required: false },
    note: { type: String, required: false }

}, {
    timestamps: true,
})


module.exports = mongoose.model('Note', noteSchema)