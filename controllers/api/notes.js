const Note = require('../../models/note')

module.exports = {
    create,
    index
};

async function index(req, res) {
    const notes = await Note.find({})
    res.json(notes)
}

async function create(req, res) {
    const newNote = await Note.create(req.body)
    return res.json(newNote)
}