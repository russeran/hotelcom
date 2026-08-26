const express = require('express')
const router = express.Router()
const notificationsCtrl = require('../../controllers/api/notifications')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const requireRole = require('../../config/requireRole')

router.get('/index', ensureLoggedIn, notificationsCtrl.index)
router.post('/create', ensureLoggedIn, notificationsCtrl.create)
router.put('/:id/read', ensureLoggedIn, notificationsCtrl.markRead)
router.delete('/delete/:id', ensureLoggedIn, requireRole('manager', 'admin'), notificationsCtrl.delete)


module.exports = router;
