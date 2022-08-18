const Complaint = require('../../models/complaint')

module.exports = {
    create,
    index,
    delete: deleteComplaint,
    update

};

async function index(req, res) {
    const complaint = await Complaint.find({})
    res.json(complaint)
}

async function create(req, res) {
    req.body.user = req.user._id
    const newComplaint = await Complaint.create(req.body)
    console.log(newComplaint)
    return res.json(newComplaint)
}

async function deleteComplaint(req, res) {
    const deleteComplaint = await Complaint.findByIdAndRemove(req.params.id)
    return res.json(deleteComplaint)
}

async function update(req, res) {
    const updateComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body)
    return res.json(updateComplaint)
}