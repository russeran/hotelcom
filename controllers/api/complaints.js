const Complaint = require('../../models/complaint')
const notifications = require('./notifications')
const audit = require('./audit')

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
    await audit.record({ req, action: 'create', entity: 'complaint', entityId: newComplaint._id, details: `Room ${newComplaint.room} · ${newComplaint.issue}` })
    return res.json(newComplaint)
}

async function deleteComplaint(req, res) {
    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) return res.status(404).json('Complaint not found')
    // The complaint's owner, or any manager/admin, may delete it.
    const isPrivileged = ['manager', 'admin'].includes(req.user.role)
    const isOwner = complaint.user && complaint.user.toString() === req.user._id
    if (!isPrivileged && !isOwner) {
        return res.status(403).json('Forbidden: only the owner or a manager can delete this complaint')
    }
    await complaint.deleteOne()
    await audit.record({ req, action: 'delete', entity: 'complaint', entityId: complaint._id, details: `Room ${complaint.room} · ${complaint.issue}` })
    return res.json(complaint)
}

async function update(req, res) {
    const updateComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true })
    await audit.record({ req, action: 'update', entity: 'complaint', entityId: req.params.id, details: JSON.stringify(req.body) })
    return res.json(updateComplaint)
}