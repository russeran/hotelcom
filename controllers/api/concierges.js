const Concierge = require('../../models/concierge');

module.exports = {
    create,
    index
};


async function index(req, res) {
    const concierges = await Concierge.find({})
    res.json(concierges)
}

async function create(req, res) {
    const newConcierge = await Concierge.create(req.body)
    return res.json(newConcierge)
}