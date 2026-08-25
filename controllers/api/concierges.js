const Concierge = require('../../models/concierge');

module.exports = {
    create,
    index,
    update,
    delete: deleteConcierge,
};


async function index(req, res) {
    const concierges = await Concierge.find({})
    res.json(concierges)
}

async function update(req, res) {
    const updatedConcierge = await Concierge.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.json(updatedConcierge)
}

async function create(req, res) {
    const newConcierge = await Concierge.create(req.body)
    return res.json(newConcierge)
}

async function deleteConcierge(req, res) {
    const deleteConcierge = await Concierge.findByIdAndDelete(req.params.id)
    return res.json(deleteConcierge)
}