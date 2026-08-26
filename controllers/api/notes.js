const Note = require('../../models/note')
const audit = require('./audit')

module.exports = {
    create,
    index,
    delete: deleteNote,
};

async function index(req, res) {
    // Managers see only their department's notes (+ department-less/general);
    // staff and admins see all.
    let filter = {}
    if (req.user && req.user.role === 'manager' && req.user.department) {
        filter = {
            $or: [
                { department: req.user.department },
                { department: { $in: [null, ''] } },
                { department: { $exists: false } }
            ]
        }
    }
    const notes = await Note.find(filter).sort({ createdAt: -1 })
    res.json(notes)
}

async function create(req, res) {
    const newNote = await Note.create(req.body)
    await audit.record({ req, action: 'create', entity: 'note', entityId: newNote._id, details: newNote.note })
    return res.json(newNote)
}

async function deleteNote(req, res) {
    const note = await Note.findById(req.params.id)
    if (!note) return res.status(404).json('Note not found')
    // The note's author (matched by name), or any manager/admin, may delete it.
    const isPrivileged = ['manager', 'admin'].includes(req.user.role)
    const isAuthor = note.user && note.user === req.user.name
    if (!isPrivileged && !isAuthor) {
        return res.status(403).json('Forbidden: only the author or a manager can delete this note')
    }
    await note.deleteOne()
    await audit.record({ req, action: 'delete', entity: 'note', entityId: note._id, details: note.note })
    return res.json(note)
}