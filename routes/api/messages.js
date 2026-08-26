const express = require('express')
const router = express.Router()
const messagesCtrl = require('../../controllers/api/messages')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.get('/index', ensureLoggedIn, messagesCtrl.index)
router.get('/channels', ensureLoggedIn, messagesCtrl.channels)
router.post('/create', ensureLoggedIn, messagesCtrl.create)


module.exports = router;
