const express = require('express')
const router = express.Router()
const notesCtrl = require('../../controllers/api/notes')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const { requireFields } = require('../../config/validate')

router.post('/create', ensureLoggedIn, requireFields('note'), notesCtrl.create)
router.get('/index', ensureLoggedIn, notesCtrl.index)
router.delete('/delete/:id', ensureLoggedIn, notesCtrl.delete)


module.exports = router;
