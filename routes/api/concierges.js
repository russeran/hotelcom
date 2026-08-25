const express = require('express')
const router = express.Router()
const conciergesCtrl = require('../../controllers/api/concierges')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.post('/create', ensureLoggedIn, conciergesCtrl.create)
router.get('/index', ensureLoggedIn, conciergesCtrl.index)
router.delete('/delete/:id', ensureLoggedIn, conciergesCtrl.delete)


module.exports = router;
