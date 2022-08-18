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
    const deleteNote = await Note.findByIdAndRemove(req.params.id)
    return res.json(deleteNote)
}