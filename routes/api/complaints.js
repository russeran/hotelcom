const express = require('express')
const router = express.Router()
const complaintsCtrl = require('../../controllers/api/complaints')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const { requireFields } = require('../../config/validate')

router.post('/create', ensureLoggedIn, requireFields('room', 'name', 'issue'), complaintsCtrl.create)
router.get('/index', ensureLoggedIn, complaintsCtrl.index)
router.delete('/delete/:id', ensureLoggedIn, complaintsCtrl.delete)
router.put('/:id', ensureLoggedIn, complaintsCtrl.update)



module.exports = router;
