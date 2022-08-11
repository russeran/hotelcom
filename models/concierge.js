const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conciergeSchema = new Schema({
    type: { type: String, required: false },
    name: { type: String, required: false },
    price: { type: Number, required: false },
    distance: { type: String, required: false },
    note: { type: String, required: false },
    user: { type: String, required: false }

}, {
    timestamps: true,
})

module.exports = mongoose.model('Concierge', conciergeSchema)