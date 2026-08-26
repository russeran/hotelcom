const express = require('express')
const router = express.Router()
const tasksCtrl = require('../../controllers/api/tasks')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const requireRole = require('../../config/requireRole')
const { requireFields } = require('../../config/validate')

router.post('/create', ensureLoggedIn, requireFields('task', 'department'), tasksCtrl.create)
router.get('/index', ensureLoggedIn, tasksCtrl.index)
router.put('/:id/acknowledge', ensureLoggedIn, tasksCtrl.acknowledge)
router.put('/:id', ensureLoggedIn, tasksCtrl.update)
// Delete is role/department-aware (managers limited to their department); enforced in the controller.
router.delete('/delete/:id', ensureLoggedIn, requireRole('manager', 'admin'), tasksCtrl.delete)



module.exports = router;
