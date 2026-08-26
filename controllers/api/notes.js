const Note = require('../../models/note')

module.exports = {
    create,
    index,
    delete: deleteNote,
};

async function index(req, res) {
    const notes = await Note.find({})
    res.json(notes)
}

async function create(req, res) {
    const newNote = await Note.create(req.body)
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
    return res.json(note)
}