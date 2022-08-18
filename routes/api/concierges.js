const express = require('express')
const router = express.Router()
const conciergesCtrl = require('../../controllers/api/concierges')

router.post('/create', conciergesCtrl.create)
router.get('/index', conciergesCtrl.index)
router.delete('/delete/:id', conciergesCtrl.delete)


module.exports = router;