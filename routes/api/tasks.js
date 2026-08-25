const express = require('express')
const router = express.Router()
const tasksCtrl = require('../../controllers/api/tasks')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

router.post('/create', ensureLoggedIn, tasksCtrl.create)
router.get('/index', ensureLoggedIn, tasksCtrl.index)
router.put('/:id', ensureLoggedIn, tasksCtrl.update)
router.delete('/delete/:id', ensureLoggedIn, tasksCtrl.delete)



module.exports = router;
