const express = require('express')
const router = express.Router()
const notesCtrl = require('../../controllers/api/notes')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.post('/create', ensureLoggedIn, notesCtrl.create)
router.get('/index', ensureLoggedIn, notesCtrl.index)
router.delete('/delete/:id', ensureLoggedIn, notesCtrl.delete)


module.exports = router;
