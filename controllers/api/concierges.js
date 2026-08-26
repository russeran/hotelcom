const Concierge = require('../../models/concierge');
const audit = require('./audit')

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
    await audit.record({ req, action: 'update', entity: 'concierge', entityId: req.params.id, details: JSON.stringify(req.body) })
    return res.json(updatedConcierge)
}

async function create(req, res) {
    const newConcierge = await Concierge.create(req.body)
    await audit.record({ req, action: 'create', entity: 'concierge', entityId: newConcierge._id, details: `${newConcierge.type} · ${newConcierge.name}` })
    return res.json(newConcierge)
}

async function deleteConcierge(req, res) {
    const deleteConcierge = await Concierge.findByIdAndDelete(req.params.id)
    await audit.record({ req, action: 'delete', entity: 'concierge', entityId: req.params.id, details: deleteConcierge ? `${deleteConcierge.type} · ${deleteConcierge.name}` : undefined })
    return res.json(deleteConcierge)
}