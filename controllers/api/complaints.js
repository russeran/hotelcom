const Complaint = require('../../models/complaint')
const notifications = require('./notifications')

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
    // Notify the Front Desk about the new complaint.
    await notifications.notify({
        department: 'Front Desk',
        message: `New complaint (room ${newComplaint.room}): ${newComplaint.issue}`,
        type: 'complaint'
    })
    return res.json(newComplaint)
}

async function deleteComplaint(req, res) {
    const deleteComplaint = await Complaint.findByIdAndDelete(req.params.id)
    return res.json(deleteComplaint)
}

async function update(req, res) {
    const updateComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.json(updateComplaint)
}