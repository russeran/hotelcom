const express = require('express')
const router = express.Router()
const reservationsCtrl = require('../../controllers/api/reservations')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const requireRole = require('../../config/requireRole')

router.get('/', ensureLoggedIn, reservationsCtrl.index)
router.post('/', ensureLoggedIn, reservationsCtrl.create)
router.put('/:id', ensureLoggedIn, reservationsCtrl.update)
router.delete('/:id', ensureLoggedIn, requireRole('manager', 'admin'), reservationsCtrl.delete)

module.exports = router;
