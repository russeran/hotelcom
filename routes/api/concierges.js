const express = require('express')
const router = express.Router()
const conciergesCtrl = require('../../controllers/api/concierges')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const requireRole = require('../../config/requireRole')
const { requireFields } = require('../../config/validate')

router.post('/create', ensureLoggedIn, requireFields('type', 'name'), conciergesCtrl.create)
router.get('/index', ensureLoggedIn, conciergesCtrl.index)
router.put('/:id', ensureLoggedIn, conciergesCtrl.update)
router.delete('/delete/:id', ensureLoggedIn, requireRole('manager', 'admin'), conciergesCtrl.delete)


module.exports = router;
