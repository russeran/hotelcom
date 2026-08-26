const express = require('express')
const router = express.Router()
const eventsCtrl = require('../../controllers/api/events')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.get('/', ensureLoggedIn, eventsCtrl.index)

module.exports = router;
