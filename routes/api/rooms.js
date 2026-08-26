const express = require('express')
const router = express.Router()
const roomsCtrl = require('../../controllers/api/rooms')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const requireRole = require('../../config/requireRole')
const { requireFields } = require('../../config/validate')

router.get('/', ensureLoggedIn, roomsCtrl.index)
router.post('/', ensureLoggedIn, requireFields('number'), roomsCtrl.create)
router.put('/:id', ensureLoggedIn, roomsCtrl.update)
router.delete('/:id', ensureLoggedIn, requireRole('manager', 'admin'), roomsCtrl.delete)

module.exports = router;
