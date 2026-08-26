const express = require('express')
const router = express.Router()
const messagesCtrl = require('../../controllers/api/messages')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const { requireFields } = require('../../config/validate')

router.get('/index', ensureLoggedIn, messagesCtrl.index)
router.get('/channels', ensureLoggedIn, messagesCtrl.channels)
router.post('/create', ensureLoggedIn, requireFields('text'), messagesCtrl.create)


module.exports = router;
