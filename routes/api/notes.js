const express = require('express')
const router = express.Router()
const notesCtrl = require('../../controllers/api/notes')

router.post('/create', notesCtrl.create)
router.get('/index', notesCtrl.index)
router.delete('/delete/:id', notesCtrl.delete)


module.exports = router;